import { supabase } from '../../src/lib/supabase';

// Facebook Webhook handler
export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    // Webhook verification
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Replace with your actual verify token
    const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN || 'your_verify_token_here';

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.status(403).send('Forbidden');
    }
  } else if (req.method === 'POST') {
    // Handle incoming messages
    const body = req.body;

    if (body.object === 'page') {
      body.entry.forEach((entry: any) => {
        const webhookEvent = entry.messaging[0];
        console.log('Received webhook event:', webhookEvent);

        // Process the message
        if (webhookEvent.message) {
          handleMessage(webhookEvent);
        }
      });

      res.status(200).send('EVENT_RECEIVED');
    } else {
      res.status(404).send('Not Found');
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

async function handleMessage(event: any) {
  const senderId = event.sender.id;
  const pageId = event.recipient.id;
  const message = event.message;
  
  console.log(`Received message from ${senderId}: ${message.text}`);
  
  try {
    // Find or create customer
    let { data: customer } = await supabase
      .from('customers')
      .select('*')
      .eq('facebook_id', senderId)
      .single();

    if (!customer) {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: `Customer ${senderId}`,
          facebook_id: senderId,
          first_name: 'Unknown',
          last_name: 'Customer',
        })
        .select('*')
        .single();

      if (customerError) {
        console.error('Error creating customer:', customerError);
        return;
      }
      customer = newCustomer;
    }

    // Find Facebook page
    const { data: fbPage } = await supabase
      .from('facebook_pages')
      .select('*')
      .eq('facebook_page_id', pageId)
      .single();

    if (!fbPage) {
      console.error('Facebook page not found:', pageId);
      return;
    }

    // Find or create conversation (24-hour rule)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    
    let { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('page_id', fbPage.id)
      .eq('customer_id', customer.id)
      .gte('last_message_at', twentyFourHoursAgo)
      .order('last_message_at', { ascending: false })
      .limit(1)
      .single();

    if (!conversation) {
      // Create new conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          page_id: fbPage.id,
          customer_id: customer.id,
          unread_count: 1,
          status: 'open',
        })
        .select('*')
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        return;
      }
      conversation = newConversation;
    } else {
      // Update existing conversation
      await supabase
        .from('conversations')
        .update({ 
          unread_count: conversation.unread_count + 1,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', conversation.id);
    }

    // Add message to conversation
    await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        text: message.text,
        sender_id: senderId,
        sender_type: 'customer',
        facebook_message_id: message.mid,
      });

    console.log('Message processed successfully');
  } catch (error) {
    console.error('Error processing message:', error);
  }
}