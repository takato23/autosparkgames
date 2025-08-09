'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '@/components/admin/AdminLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  MessageSquare, 
  Check, 
  X, 
  AlertTriangle, 
  Filter,
  Search,
  ChevronUp,
  Bot,
  Send,
  RefreshCw
} from 'lucide-react'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Question {
  id: string
  text: string
  author: string
  timestamp: Date
  votes: number
  status: 'pending' | 'approved' | 'rejected'
  presentationId: string
  presentationTitle: string
  aiScore?: number
  aiReason?: string
}

const mockQuestions: Question[] = [
  {
    id: '1',
    text: 'How does the new feature integrate with our existing workflow?',
    author: 'John Doe',
    timestamp: new Date(Date.now() - 5 * 60000),
    votes: 12,
    status: 'pending',
    presentationId: 'pres1',
    presentationTitle: 'Product Update Q4',
    aiScore: 0.95,
    aiReason: 'Professional question about product integration'
  },
  {
    id: '2',
    text: 'This is spam! Buy crypto now!!!',
    author: 'Anonymous',
    timestamp: new Date(Date.now() - 10 * 60000),
    votes: 0,
    status: 'pending',
    presentationId: 'pres1',
    presentationTitle: 'Product Update Q4',
    aiScore: 0.1,
    aiReason: 'Spam content detected with promotional language'
  },
  {
    id: '3',
    text: 'What are the security implications of this change?',
    author: 'Sarah Johnson',
    timestamp: new Date(Date.now() - 15 * 60000),
    votes: 8,
    status: 'approved',
    presentationId: 'pres2',
    presentationTitle: 'Security Best Practices',
    aiScore: 0.98,
    aiReason: 'Relevant security question'
  }
]

export default function ModerationPage() {
  const [questions, setQuestions] = useState<Question[]>(mockQuestions)
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>(mockQuestions)
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPresentation, setSelectedPresentation] = useState<string>('all')
  const [testQuestion, setTestQuestion] = useState('')
  const [testResult, setTestResult] = useState<{ score: number; reason: string } | null>(null)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    filterQuestions()
  }, [questions, statusFilter, searchTerm, selectedPresentation])

  const filterQuestions = () => {
    let filtered = questions

    if (statusFilter !== 'all') {
      filtered = filtered.filter(q => q.status === statusFilter)
    }

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.author.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedPresentation !== 'all') {
      filtered = filtered.filter(q => q.presentationId === selectedPresentation)
    }

    setFilteredQuestions(filtered)
  }

  const handleApprove = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, status: 'approved' } : q
    ))
  }

  const handleReject = (questionId: string) => {
    setQuestions(questions.map(q => 
      q.id === questionId ? { ...q, status: 'rejected' } : q
    ))
  }

  const handleTestAI = async () => {
    if (!testQuestion.trim()) return

    setTesting(true)
    // Simulate AI processing
    setTimeout(() => {
      const isSpam = testQuestion.toLowerCase().includes('spam') || 
                     testQuestion.toLowerCase().includes('buy') ||
                     testQuestion.includes('!!!') ||
                     testQuestion.length < 10

      const score = isSpam ? Math.random() * 0.3 : 0.7 + Math.random() * 0.3
      const reason = isSpam 
        ? 'Potential spam or low-quality content detected'
        : 'Question appears relevant and appropriate'

      setTestResult({ score, reason })
      setTesting(false)
    }, 1000)
  }

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600 dark:text-green-400'
    if (score >= 0.4) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const presentations = [
    { id: 'all', title: 'All Presentations' },
    { id: 'pres1', title: 'Product Update Q4' },
    { id: 'pres2', title: 'Security Best Practices' }
  ]

  return (
    <AdminLayout>
      <div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Q&A Moderation
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Review and moderate questions from your presentations
          </p>
        </motion.div>

        {/* AI Testing Tool */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Moderation Testing
            </CardTitle>
            <CardDescription>
              Test how the AI moderation system would score a question
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  value={testQuestion}
                  onChange={(e) => setTestQuestion(e.target.value)}
                  placeholder="Enter a test question to see how AI would score it..."
                  rows={2}
                  className="flex-1"
                />
                <Button onClick={handleTestAI} disabled={testing}>
                  {testing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {testResult && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">AI Score:</span>
                    <span className={`text-2xl font-bold ${getScoreColor(testResult.score)}`}>
                      {(testResult.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {testResult.reason}
                  </p>
                  <div className="mt-3 text-sm">
                    <span className="font-medium">Recommendation: </span>
                    {testResult.score >= 0.7 ? (
                      <span className="text-green-600 dark:text-green-400">Auto-approve</span>
                    ) : testResult.score >= 0.4 ? (
                      <span className="text-yellow-600 dark:text-yellow-400">Manual review needed</span>
                    ) : (
                      <span className="text-red-600 dark:text-red-400">Auto-reject</span>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedPresentation} onValueChange={setSelectedPresentation}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select presentation" />
            </SelectTrigger>
            <SelectContent>
              {presentations.map(pres => (
                <SelectItem key={pres.id} value={pres.id}>
                  {pres.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'approved' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('approved')}
            >
              Approved
            </Button>
            <Button
              variant={statusFilter === 'rejected' ? 'default' : 'outline'}
              onClick={() => setStatusFilter('rejected')}
            >
              Rejected
            </Button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredQuestions.map((question, index) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={question.status === 'pending' ? 'border-orange-500' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="font-semibold">{question.author}</h3>
                          <span className="text-sm text-gray-500">
                            {question.timestamp.toLocaleTimeString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            from {question.presentationTitle}
                          </span>
                          {question.aiScore && (
                            <div className="flex items-center gap-2">
                              <Bot className="h-4 w-4 text-gray-400" />
                              <span className={`text-sm font-medium ${getScoreColor(question.aiScore)}`}>
                                {(question.aiScore * 100).toFixed(0)}%
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-3">
                          {question.text}
                        </p>
                        {question.aiReason && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3">
                            AI: {question.aiReason}
                          </p>
                        )}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <ChevronUp className="h-4 w-4" />
                            {question.votes} votes
                          </div>
                          <span className={`
                            px-2 py-1 rounded-full text-xs font-medium
                            ${question.status === 'approved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                              : question.status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }
                          `}>
                            {question.status}
                          </span>
                        </div>
                      </div>
                      {question.status === 'pending' && (
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                            onClick={() => handleApprove(question.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleReject(question.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredQuestions.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No questions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Questions from your presentations will appear here'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}