export class ElevenLabsService {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
  }

  async makeVoiceCall(userId: string, phoneNumber: string, callType: string, emailData: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('11 Labs API key not configured. Please provide ELEVENLABS_API_KEY');
    }

    const voiceScript = this.generateVoiceScript(callType, emailData);
    
    try {
      // Generate audio with 11 Labs
      const audioResponse = await fetch(`${this.baseUrl}/text-to-speech/your-voice-id`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: voiceScript,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!audioResponse.ok) {
        throw new Error(`11 Labs API error: ${audioResponse.statusText}`);
      }

      // 11 Labs returns audio data - you would integrate this with your calling system
      // For now, return success response
      return {
        success: true,
        message: 'Voice call prepared with 11 Labs',
        audioGenerated: true,
        script: voiceScript
      };
    } catch (error) {
      console.error('11 Labs voice generation error:', error);
      throw error;
    }
  }

  private generateVoiceScript(callType: string, emailData: any): string {
    switch (callType) {
      case 'daily-digest':
        return `Hello! This is your PookAi assistant. You have ${emailData.emailCount} new emails in your priority categories. Would you like me to summarize them for you?`;
      
      case 'urgent-alert':
        return `Hello! This is PookAi with an urgent email alert. You have ${emailData.urgentCount} high-priority emails that need your immediate attention.`;
      
      case 'category-alert':
        const { domain, category, senderCount, totalEmails, senders } = emailData;
        const topSenders = senders.slice(0, 3).map(s => s.name).join(', ');
        return `Hello! This is PookAi. You have ${totalEmails} new emails from ${senderCount} senders at ${domain} in your ${category} category. Top senders include: ${topSenders}. Would you like me to provide more details?`;
      
      case 'test':
        return `Hello! This is a test call from PookAi. Your email management system is working correctly. You have ${emailData.emailCount} emails being monitored.`;
      
      default:
        return `Hello! This is PookAi. You have ${emailData.emailCount || 0} emails to review.`;
    }
  }

  async getVoices(): Promise<any> {
    if (!this.apiKey) {
      throw new Error('11 Labs API key not configured');
    }

    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch voices: ${response.statusText}`);
    }

    return response.json();
  }
}