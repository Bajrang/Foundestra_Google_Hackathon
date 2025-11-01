import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Separator } from '../ui/separator';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  RefreshCw, 
  Copy, 
  ExternalLink,
  Sparkles,
  Cloud,
  Key,
  Settings
} from 'lucide-react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';

interface APIConfig {
  status: string;
  timestamp?: string;
  configuration?: {
    projectId: string;
    authentication: {
      apiKey: string;
      apiKeyPreview?: string;
      serviceAccountKey: string;
      credentialsPath: string;
    };
    endpoint?: {
      current: string;
      authMethod: string;
      requiresOAuth: boolean;
    };
    recommendation?: string;
    nextSteps?: string[];
  };
  troubleshooting?: {
    commonIssues: Array<{
      issue: string;
      cause: string;
      fix: string;
    }>;
  };
}

interface TestResult {
  status: string;
  message: string;
  details?: any;
  capabilities?: string[];
  nextSteps?: string[];
  instructions?: string[];
  guidance?: string;
  helpUrl?: string;
}

export function APIStatusPage() {
  const [config, setConfig] = useState<APIConfig | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);

  const fetchConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/vertex-config`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      setConfig(data);
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    setTesting(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-f7922768/test-vertexai`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      setTestResult(data);
    } catch (error) {
      console.error('Failed to test connection:', error);
      setTestResult({
        status: 'error',
        message: 'Failed to connect to API endpoint'
      });
    } finally {
      setTesting(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: string) => {
    if (status.includes('✓') || status.includes('Set')) {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    } else if (status.includes('✗') || status.includes('Not set')) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    } else {
      return <AlertCircle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('✓') || status.includes('Set')) {
      return 'bg-green-100 text-green-800';
    } else if (status.includes('✗') || status.includes('Not set')) {
      return 'bg-red-100 text-red-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="flex items-center justify-center gap-2">
            <Settings className="w-8 h-8" />
            API Configuration & Status
          </h1>
          <p className="text-gray-600">
            Check your Google Gemini AI integration status and troubleshoot issues
          </p>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={fetchConfig} disabled={loading}>
              {loading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
              Refresh Config
            </Button>
            <Button onClick={testConnection} disabled={testing} variant="outline">
              {testing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : null}
              Test Connection
            </Button>
          </CardContent>
        </Card>

        {/* Configuration Status */}
        {config && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Authentication Configuration
              </CardTitle>
              <CardDescription>
                Current environment variables and authentication setup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project ID */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Cloud className="w-4 h-4" />
                    <span>Google Cloud Project ID</span>
                  </div>
                  <code className="text-sm text-gray-600">
                    {config.configuration?.projectId || 'not-set'}
                  </code>
                </div>
              </div>

              {/* Authentication Methods */}
              <div className="space-y-3">
                <h4>Authentication Methods:</h4>
                
                {/* API Key */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusIcon(config.configuration?.authentication.apiKey || '')}
                      <span>API Key (VERTEX_AI_API_KEY)</span>
                    </div>
                    {config.configuration?.authentication.apiKeyPreview && (
                      <code className="text-xs text-gray-600">
                        {config.configuration.authentication.apiKeyPreview}
                      </code>
                    )}
                  </div>
                  <Badge className={getStatusColor(config.configuration?.authentication.apiKey || '')}>
                    {config.configuration?.authentication.apiKey}
                  </Badge>
                </div>

                {/* Service Account */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(config.configuration?.authentication.serviceAccountKey || '')}
                    <span>Service Account Key</span>
                  </div>
                  <Badge className={getStatusColor(config.configuration?.authentication.serviceAccountKey || '')}>
                    {config.configuration?.authentication.serviceAccountKey}
                  </Badge>
                </div>
              </div>

              <Separator />

              {/* Current Endpoint */}
              {config.configuration?.endpoint && (
                <div className="space-y-2">
                  <h4>Current Endpoint:</h4>
                  <div className="p-3 bg-blue-50 rounded-lg space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <code className="text-sm break-all">
                        {config.configuration.endpoint.current}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(config.configuration!.endpoint!.current)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="text-sm text-gray-600">
                      Auth Method: {config.configuration.endpoint.authMethod}
                    </div>
                    <div className="text-sm text-gray-600">
                      Requires OAuth: {config.configuration.endpoint.requiresOAuth ? 'Yes' : 'No'}
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              {/* Recommendation */}
              {config.configuration?.recommendation && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Recommendation</AlertTitle>
                  <AlertDescription>
                    {config.configuration.recommendation}
                  </AlertDescription>
                </Alert>
              )}

              {/* Next Steps */}
              {config.configuration?.nextSteps && config.configuration.nextSteps.length > 0 && (
                <div className="space-y-2">
                  <h4>Next Steps:</h4>
                  <ul className="space-y-2">
                    {config.configuration.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">•</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {testResult.status === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                Connection Test Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Message */}
              <Alert variant={testResult.status === 'success' ? 'default' : 'destructive'}>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>
                  {testResult.status === 'success' ? 'Success' : 'Error'}
                </AlertTitle>
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>

              {/* Capabilities (Success) */}
              {testResult.capabilities && (
                <div className="space-y-2">
                  <h4>Enabled Capabilities:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {testResult.capabilities.map((capability, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-green-50 rounded-lg text-sm"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span>{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructions (Error) */}
              {testResult.instructions && (
                <div className="space-y-2">
                  <h4>Setup Instructions:</h4>
                  <ol className="space-y-2">
                    {testResult.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="font-mono text-blue-600 mt-1">{index + 1}.</span>
                        <span className="text-sm">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Guidance & Help URL */}
              {testResult.guidance && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm">{testResult.guidance}</p>
                  {testResult.helpUrl && (
                    <a
                      href={testResult.helpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 mt-2"
                    >
                      Learn more <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              )}

              {/* Next Steps */}
              {testResult.nextSteps && testResult.nextSteps.length > 0 && (
                <div className="space-y-2">
                  <h4>What to do next:</h4>
                  <ul className="space-y-2">
                    {testResult.nextSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">→</span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Troubleshooting */}
        {config?.troubleshooting?.commonIssues && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Common Issues & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {config.troubleshooting.commonIssues.map((item, index) => (
                <div key={index} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>{item.issue}</span>
                  </div>
                  <div className="text-sm text-gray-600 ml-6">
                    <strong>Cause:</strong> {item.cause}
                  </div>
                  <div className="text-sm text-green-700 ml-6 bg-green-50 p-2 rounded">
                    <strong>Fix:</strong> {item.fix}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5" />
              Helpful Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Key className="w-4 h-4" />
              <span>Get API Key</span>
              <ExternalLink className="w-3 h-3 ml-auto" />
            </a>
            <a
              href="https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Enable API</span>
              <ExternalLink className="w-3 h-3 ml-auto" />
            </a>
            <a
              href="https://ai.google.dev/gemini-api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>API Documentation</span>
              <ExternalLink className="w-3 h-3 ml-auto" />
            </a>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Cloud className="w-4 h-4" />
              <span>Supabase Dashboard</span>
              <ExternalLink className="w-3 h-3 ml-auto" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
