import { motion } from "framer-motion";
import { CheckCircle, Settings, Phone, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mockAgentTasks } from "@/data/mock-data";
// import Plan from "@/components/ui/agent-plan";

export default function FinalSetup() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-400/20';
      case 'in-progress':
        return 'text-blue-400 bg-blue-400/20';
      case 'pending':
        return 'text-gray-400 bg-gray-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'fas fa-check';
      case 'in-progress':
        return 'fas fa-circle-notch animate-spin';
      case 'pending':
        return 'fas fa-clock';
      default:
        return 'fas fa-pause';
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-primary">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        {/* Setup Confirmation */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-20 h-20 bg-primary text-background neopop-button mx-auto mb-6 flex items-center justify-center"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-8 h-8" />
          </motion.div>
          <h1 className="text-3xl font-semibold mb-4 tracking-tight">Your Concierge is Ready!</h1>
          <p className="text-muted-foreground mb-6">Your inbox rules are configured. Voice calls coming soon in Phase 2.</p>
          
          {/* Next Call Info */}
          <motion.div 
            className="neopop-card p-6 max-w-md mx-auto mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-semibold mb-4">Your First Call</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Voice:</span>
                <span>Sarah</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Time:</span>
                <span>Tomorrow at 9:00 AM PST</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Duration:</span>
                <span>~2-3 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Phone:</span>
                <span>(555) ***-4567</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Agent Plan Dashboard */}
        <motion.div 
          className="bg-gray-900 border border-gray-700 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Your AI Agent Plan</h2>
            <p className="text-gray-400">Track your agent's daily tasks and progress</p>
          </div>

          {/* Simplified Agent Tasks - Alternative to agent-plan component */}
          <div className="space-y-4 mb-8">
            {mockAgentTasks.map((task, index) => (
              <motion.div
                key={task.id}
                className={`neopop-card p-4 ${
                  task.status === 'in-progress' ? 'border-primary' : ''
                } ${task.status === 'waiting' ? 'opacity-50' : ''}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 neopop-button flex items-center justify-center ${
                      task.status === 'completed' ? 'bg-primary' :
                      task.status === 'in-progress' ? 'bg-primary' :
                      task.status === 'pending' ? 'bg-border' : 'bg-border'
                    }`}>
                      {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-background" />}
                      {task.status === 'in-progress' && (
                        <motion.div
                          className="w-2 h-2 bg-background rounded-full"
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        />
                      )}
                      {(task.status === 'pending' || task.status === 'waiting') && (
                        <motion.div className="w-2 h-2 bg-background rounded-full" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(task.status)}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}
                  </span>
                </div>
                {task.details.length > 0 && (
                  <div className="ml-9">
                    <div className="text-xs text-muted-foreground space-y-1">
                      {task.details.map((detail, detailIndex) => (
                        <div key={detailIndex}>{detail}</div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Dashboard Actions */}
          <motion.div 
            className="pt-6 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="neopop-button bg-card hover:bg-muted text-foreground transition-colors"
              >
                <Settings className="mr-2 w-4 h-4" />
                Modify Settings
              </Button>
              <Button
                variant="outline"
                className="neopop-button bg-card hover:bg-muted text-foreground transition-colors"
              >
                <Phone className="mr-2 w-4 h-4" />
                Test Call Now
              </Button>
              <Button
                variant="outline"
                className="neopop-button bg-card hover:bg-muted text-foreground transition-colors"
              >
                <History className="mr-2 w-4 h-4" />
                Call History
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
