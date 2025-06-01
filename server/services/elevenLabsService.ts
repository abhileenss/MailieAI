export class ElevenLabsService {
  private apiKey: string | undefined;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
  }

  async createConversationalAgent(userId: string, emailData: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('11 Labs API key not configured. Please provide ELEVENLABS_API_KEY');
    }

    const agentConfig = this.generateAgentConfig(emailData);
    
    try {
      // Create conversational agent with 11 Labs
      const agentResponse = await fetch(`${this.baseUrl}/convai/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          agent_id: process.env.ELEVENLABS_AGENT_ID || 'your-agent-id',
          ...agentConfig
        })
      });

      if (!agentResponse.ok) {
        throw new Error(`11 Labs Conversational AI error: ${agentResponse.statusText}`);
      }

      const conversationData = await agentResponse.json();

      return {
        success: true,
        conversationId: conversationData.conversation_id,
        message: 'Conversational AI agent created for email summary',
        emailContext: emailData
      };
    } catch (error) {
      console.error('11 Labs conversational AI error:', error);
      throw error;
    }
  }

  async generateVoiceAudio(script: string, voiceId: string = 'rachel'): Promise<Buffer> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    try {
      const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text: script,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.statusText}`);
      }

      return Buffer.from(await response.arrayBuffer());
    } catch (error) {
      console.error('Error generating voice audio:', error);
      throw error;
    }
  }

  async makeVoiceCall(userId: string, phoneNumber: string, callType: string, emailData: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('ElevenLabs API key not configured');
    }

    // Create conversational agent first
    const agentResult = await this.createConversationalAgent(userId, emailData);
    
    return {
      success: true,
      message: 'Voice conversation ready with 11 Labs Conversational AI',
      conversationId: agentResult.conversationId,
      callType,
      emailData,
      phoneNumber
    };
  }

  private getVoiceId(voicePreference: string): string {
    const voiceMapping = {
      'morgan-freeman': 'pNInz6obpgDQGcFmaJgB', // Morgan Freeman style voice
      'naval-ravikant': 'EXAVITQu4vr4xnSDxMaL', // Naval Ravikant style voice
      'joe-rogan': 'VR6AewLTigWG4xSOukaG', // Joe Rogan style voice
      'andrew-schulz': '29vD33N1CtxCmqQRPOHJ', // Andrew Schulz style voice
      'amitabh-bachchan': 'TX3LPaxmHKxFdv7VOQHJ', // Amitabh Bachchan style voice
      'priyanka-chopra': 'ThT5KcBeYPX3keUQqHPh' // Priyanka Chopra style voice
    };
    
    return voiceMapping[voicePreference] || voiceMapping['morgan-freeman'];
  }

  private generateAgentConfig(emailData: any): any {
    const context = this.buildEmailContext(emailData);
    const voiceId = this.getVoiceId(emailData.voicePreference || 'morgan-freeman');
    
    return {
      system_prompt: `You are PookAi, a helpful AI assistant for busy professionals. You're calling to provide an email summary and help prioritize important communications. 

Email Context: ${context}

Be concise, friendly, and professional. Ask if the user wants details about specific emails or senders.`,
      
      first_message: this.generateOpeningMessage(emailData),
      
      language: "en",
      
      voice_id: voiceId,
      
      voice_settings: {
        stability: 0.7,
        similarity_boost: 0.8,
        style: 0.3,
        use_speaker_boost: true
      }
    };
  }

  private buildEmailContext(emailData: any): string {
    const { domain, category, senderCount, totalEmails, senders } = emailData;
    
    if (domain && category) {
      const topSenders = senders?.slice(0, 3).map(s => `${s.name} (${s.emailCount} emails)`).join(', ') || '';
      return `${totalEmails} emails from ${senderCount} senders at ${domain} in ${category} category. Key senders: ${topSenders}`;
    }
    
    return `Email summary with ${emailData.emailCount || 0} total emails requiring attention.`;
  }

  private generateOpeningMessage(emailData: any): string {
    const { domain, category, senderCount, totalEmails } = emailData;
    
    if (domain && category) {
      return `Hi! This is PookAi calling about your ${category} emails. You have ${totalEmails} new emails from ${domain} that need your attention. Would you like me to summarize them for you?`;
    }
    
    return `Hi! This is PookAi with your email update. You have ${emailData.emailCount || 0} emails to review. How can I help you prioritize them?`;
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