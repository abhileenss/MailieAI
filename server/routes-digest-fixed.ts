// Fixed digest generation that ONLY uses your manually categorized "call-me" senders

app.post('/api/emails/generate-digest-script', isAuthenticated, async (req: Request, res: Response) => {
  try {
    const userId = req.user.claims.sub;
    console.log(`Generating digest for user: ${userId}`);
    
    // Step 1: Get ONLY senders you've manually marked as "call-me"
    const allSenders = await storage.getEmailSenders(userId);
    const callMeSenders = allSenders.filter(sender => 
      sender.category === 'call-me' && sender.emailCount > 0
    );
    
    console.log(`You have marked ${callMeSenders.length} senders as "call-me"`);
    
    if (callMeSenders.length === 0) {
      return res.json({
        success: true,
        script: "Hey! mailieAI here. You haven't marked any email senders as 'call-me' yet. Go categorize some important senders first.",
        emailsAnalyzed: 0,
        newEmailsFound: 0,
        importantEmailsFound: 0,
        meetingsFound: 0,
        timestamp: new Date().toISOString()
      });
    }
    
    // Step 2: Create script ONLY from your "call-me" categorized senders
    const recentCallMeSenders = callMeSenders
      .sort((a, b) => new Date(b.latestMessageDate).getTime() - new Date(a.latestMessageDate).getTime())
      .slice(0, 5); // Top 5 most recent
    
    // Step 3: Generate focused script
    let script = "Hey! mailieAI here. ";
    
    if (recentCallMeSenders.length === 1) {
      const sender = recentCallMeSenders[0];
      script += `Latest from ${sender.name || sender.email.split('@')[0]}: ${sender.latestSubject}. That's your priority.`;
    } else if (recentCallMeSenders.length <= 3) {
      const senderNames = recentCallMeSenders.map(s => s.name || s.email.split('@')[0]);
      script += `Updates from ${senderNames.join(', ')}. Check these ${recentCallMeSenders.length} important messages.`;
    } else {
      const topTwo = recentCallMeSenders.slice(0, 2).map(s => s.name || s.email.split('@')[0]);
      script += `Priority updates from ${topTwo.join(' and ')} plus ${recentCallMeSenders.length - 2} other important contacts.`;
    }
    
    // Count meetings in your categorized senders
    const meetingCount = recentCallMeSenders.filter(sender => 
      ['meeting', 'call', 'zoom', 'conference', 'appointment'].some(keyword =>
        (sender.latestSubject?.toLowerCase() || '').includes(keyword)
      )
    ).length;
    
    res.json({
      success: true,
      script: script,
      emailsAnalyzed: callMeSenders.length,
      newEmailsFound: 0,
      importantEmailsFound: recentCallMeSenders.length,
      meetingsFound: meetingCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error generating digest:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate digest script'
    });
  }
});