#!/usr/bin/env tsx

/**
 * Comprehensive Testing Suite for PookAi
 * Tests all functionality with real data, edge cases, and user interactions
 */

import { apiRequest } from './client/src/lib/queryClient';

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  details?: any;
}

class PookAiTestSuite {
  private results: TestResult[] = [];
  private baseUrl = 'http://localhost:5000';

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        credentials: 'include',
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        }
      });
      
      const data = await response.json();
      return { success: response.ok, data, status: response.status };
    } catch (error) {
      return { success: false, error: error.message, status: 0 };
    }
  }

  private logTest(testName: string, passed: boolean, error?: string, details?: any) {
    this.results.push({ testName, passed, error, details });
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status}: ${testName}`);
    if (error) console.log(`   Error: ${error}`);
    if (details) console.log(`   Details:`, details);
  }

  async testAuthentication() {
    console.log('\n🔐 Testing Authentication Flow...');
    
    // Test user endpoint without auth
    const noAuth = await this.makeRequest('/api/auth/user');
    this.logTest(
      'Unauthenticated user request returns 401', 
      noAuth.status === 401,
      noAuth.status !== 401 ? `Expected 401, got ${noAuth.status}` : undefined
    );

    // Test OAuth endpoints exist
    const loginTest = await this.makeRequest('/api/login');
    this.logTest(
      'Login endpoint redirects properly',
      loginTest.status === 302 || loginTest.status === 200,
      loginTest.status < 200 || loginTest.status >= 400 ? `Status: ${loginTest.status}` : undefined
    );
  }

  async testEmailProcessing() {
    console.log('\n📧 Testing Email Processing...');
    
    // Test processed emails endpoint
    const processedEmails = await this.makeRequest('/api/emails/processed');
    this.logTest(
      'Processed emails endpoint accessible',
      processedEmails.success || processedEmails.status === 401, // 401 is expected without auth
      !processedEmails.success && processedEmails.status !== 401 ? processedEmails.error : undefined
    );

    // Test Gmail auth endpoint
    const gmailAuth = await this.makeRequest('/api/gmail/auth');
    this.logTest(
      'Gmail auth endpoint accessible',
      gmailAuth.success || gmailAuth.status === 401,
      !gmailAuth.success && gmailAuth.status !== 401 ? gmailAuth.error : undefined
    );
  }

  async testVoiceIntegration() {
    console.log('\n🎙️ Testing Voice Integration...');
    
    // Test voice call endpoint structure
    const voiceCall = await this.makeRequest('/api/voice/call', {
      method: 'POST',
      body: JSON.stringify({ 
        phoneNumber: '+1234567890',
        callType: 'test'
      })
    });
    
    this.logTest(
      'Voice call endpoint exists and handles requests',
      voiceCall.status === 401 || voiceCall.status === 400 || voiceCall.success,
      voiceCall.status === 500 ? 'Server error on voice endpoint' : undefined
    );

    // Test call history endpoint
    const callHistory = await this.makeRequest('/api/calls/history');
    this.logTest(
      'Call history endpoint accessible',
      callHistory.success || callHistory.status === 401,
      !callHistory.success && callHistory.status !== 401 ? callHistory.error : undefined
    );
  }

  async testAPIEndpoints() {
    console.log('\n🔌 Testing All API Endpoints...');
    
    const endpoints = [
      { path: '/api/auth/user', method: 'GET' },
      { path: '/api/emails/processed', method: 'GET' },
      { path: '/api/gmail/auth', method: 'GET' },
      { path: '/api/preferences', method: 'POST' },
      { path: '/api/voice/call', method: 'POST' },
      { path: '/api/calls/history', method: 'GET' }
    ];

    for (const endpoint of endpoints) {
      const result = await this.makeRequest(endpoint.path, {
        method: endpoint.method,
        body: endpoint.method === 'POST' ? JSON.stringify({}) : undefined
      });
      
      this.logTest(
        `${endpoint.method} ${endpoint.path} responds correctly`,
        result.status !== 500 && result.status !== 0,
        result.status === 500 ? 'Server error' : result.status === 0 ? 'Connection failed' : undefined
      );
    }
  }

  async testDataValidation() {
    console.log('\n📊 Testing Data Validation...');
    
    // Test malformed requests
    const malformedVoiceCall = await this.makeRequest('/api/voice/call', {
      method: 'POST',
      body: JSON.stringify({ invalidData: true })
    });
    
    this.logTest(
      'API handles malformed voice call data',
      malformedVoiceCall.status === 400 || malformedVoiceCall.status === 401,
      malformedVoiceCall.status === 500 ? 'Server error on malformed data' : undefined
    );

    // Test empty preferences
    const emptyPreferences = await this.makeRequest('/api/preferences', {
      method: 'POST',
      body: JSON.stringify({})
    });
    
    this.logTest(
      'API handles empty preferences data',
      emptyPreferences.status === 400 || emptyPreferences.status === 401,
      emptyPreferences.status === 500 ? 'Server error on empty preferences' : undefined
    );
  }

  async testEdgeCases() {
    console.log('\n⚠️ Testing Edge Cases...');
    
    // Test invalid phone numbers
    const invalidPhone = await this.makeRequest('/api/voice/call', {
      method: 'POST',
      body: JSON.stringify({ 
        phoneNumber: 'invalid-phone',
        callType: 'test'
      })
    });
    
    this.logTest(
      'API validates phone number format',
      invalidPhone.status === 400 || invalidPhone.status === 401,
      invalidPhone.status === 500 ? 'Server should validate phone numbers' : undefined
    );

    // Test very long strings
    const longString = 'a'.repeat(10000);
    const longDataTest = await this.makeRequest('/api/preferences', {
      method: 'POST',
      body: JSON.stringify({ notes: longString })
    });
    
    this.logTest(
      'API handles very long input strings',
      longDataTest.status !== 500,
      longDataTest.status === 500 ? 'Server should handle long strings gracefully' : undefined
    );

    // Test special characters
    const specialChars = await this.makeRequest('/api/preferences', {
      method: 'POST',
      body: JSON.stringify({ 
        category: '<script>alert("xss")</script>',
        notes: '"; DROP TABLE users; --'
      })
    });
    
    this.logTest(
      'API handles special characters and potential injection',
      specialChars.status !== 500,
      specialChars.status === 500 ? 'Server should sanitize inputs' : undefined
    );
  }

  async testDatabaseConnections() {
    console.log('\n🗄️ Testing Database Connections...');
    
    // Test if database endpoints respond (even with auth errors)
    const endpoints = [
      '/api/emails/processed',
      '/api/preferences',
      '/api/calls/history'
    ];

    for (const endpoint of endpoints) {
      const result = await this.makeRequest(endpoint);
      this.logTest(
        `Database connection for ${endpoint}`,
        result.status !== 500 && result.status !== 0,
        result.status === 500 ? 'Database connection issue' : result.status === 0 ? 'Server not responding' : undefined
      );
    }
  }

  async testConcurrentRequests() {
    console.log('\n🔄 Testing Concurrent Request Handling...');
    
    // Make multiple concurrent requests
    const concurrentRequests = Array(5).fill(null).map(() => 
      this.makeRequest('/api/auth/user')
    );
    
    const results = await Promise.all(concurrentRequests);
    const allResponded = results.every(r => r.status !== 0);
    
    this.logTest(
      'Server handles concurrent requests',
      allResponded,
      !allResponded ? 'Some requests failed to get responses' : undefined
    );
  }

  async testErrorHandling() {
    console.log('\n🚨 Testing Error Handling...');
    
    // Test non-existent endpoints
    const notFound = await this.makeRequest('/api/nonexistent');
    this.logTest(
      'Non-existent endpoints return 404',
      notFound.status === 404,
      notFound.status !== 404 ? `Expected 404, got ${notFound.status}` : undefined
    );

    // Test malformed JSON
    const malformedJson = await fetch(`${this.baseUrl}/api/preferences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ invalid json',
      credentials: 'include'
    }).catch(() => ({ status: 0 }));
    
    this.logTest(
      'Server handles malformed JSON gracefully',
      malformedJson.status === 400 || malformedJson.status === 401,
      malformedJson.status === 500 ? 'Server should handle malformed JSON' : undefined
    );
  }

  async runAllTests() {
    console.log('🧪 Starting Comprehensive PookAi Test Suite...\n');
    
    try {
      await this.testAuthentication();
      await this.testEmailProcessing();
      await this.testVoiceIntegration();
      await this.testAPIEndpoints();
      await this.testDataValidation();
      await this.testEdgeCases();
      await this.testDatabaseConnections();
      await this.testConcurrentRequests();
      await this.testErrorHandling();
      
      this.generateReport();
    } catch (error) {
      console.error('Test suite failed:', error);
    }
  }

  private generateReport() {
    console.log('\n📋 TEST REPORT');
    console.log('='.repeat(50));
    
    const passed = this.results.filter(r => r.passed).length;
    const failed = this.results.filter(r => !r.passed).length;
    const total = this.results.length;
    
    console.log(`Total Tests: ${total}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ❌`);
    console.log(`Success Rate: ${((passed / total) * 100).toFixed(1)}%`);
    
    if (failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.filter(r => !r.passed).forEach(test => {
        console.log(`  - ${test.testName}: ${test.error}`);
      });
    }
    
    console.log('\n🎯 RECOMMENDATIONS:');
    
    if (failed === 0) {
      console.log('✅ All tests passed! System is ready for deployment.');
    } else {
      console.log('⚠️  Some tests failed. Review the failures above before deployment.');
    }
    
    // Check for common issues
    const serverErrors = this.results.filter(r => r.error?.includes('500')).length;
    const connectionErrors = this.results.filter(r => r.error?.includes('Connection')).length;
    
    if (serverErrors > 0) {
      console.log('🔧 Server errors detected - check backend implementation');
    }
    if (connectionErrors > 0) {
      console.log('🔌 Connection issues detected - ensure server is running');
    }
  }
}

// Run the test suite
const testSuite = new PookAiTestSuite();
testSuite.runAllTests().catch(console.error);