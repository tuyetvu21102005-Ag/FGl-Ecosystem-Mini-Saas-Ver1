
export async function sendWebhookNotification(url: string, data: any) {
  if (!url) return;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'lead.created',
        timestamp: new Date().toISOString(),
        data: data
      }),
    });

    if (!response.ok) {
      console.error(`Lỗi Webhook (${response.status}):`, await response.text());
    }
  } catch (error) {
    console.error('Lỗi kết nối Webhook:', error);
  }
}
