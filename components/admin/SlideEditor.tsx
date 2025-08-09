'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Slide, 
  SlideType,
  MultipleChoiceSlide,
  WordCloudSlide,
  QASlide,
  PollSlide,
  OpenTextSlide,
  RatingSlide,
  TitleSlide,
  TriviaSlide,
  IceBreakerSlide,
  TeamChallengeSlide,
  LeaderboardSlide
} from '@/lib/types/presentation'
import { Plus, Trash2, Settings } from 'lucide-react'

interface SlideEditorProps {
  slide: Slide
  onUpdate: (updates: Partial<Slide>) => void
}

export default function SlideEditor({ slide, onUpdate }: SlideEditorProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const renderTitleSlideEditor = (slide: TitleSlide) => (
    <>
      <div className="space-y-2">
        <Label>Title</Label>
        <Input
          value={slide.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Slide Title"
        />
      </div>
      <div className="space-y-2">
        <Label>Subtitle</Label>
        <Input
          value={slide.subtitle || ''}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          placeholder="Optional subtitle"
        />
      </div>
      <div className="space-y-2">
        <Label>Image URL</Label>
        <Input
          value={slide.imageUrl || ''}
          onChange={(e) => onUpdate({ imageUrl: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>
    </>
  )

  const renderMultipleChoiceEditor = (slide: MultipleChoiceSlide) => (
    <>
      <div className="space-y-2">
        <Label>Question</Label>
        <Textarea
          value={slide.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your question"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {slide.options.map((option, index) => (
            <div key={option.id} className="flex gap-2">
              <Input
                value={option.text}
                onChange={(e) => {
                  const newOptions = [...slide.options]
                  newOptions[index] = { ...option, text: e.target.value }
                  onUpdate({ options: newOptions })
                }}
                placeholder={`Option ${index + 1}`}
              />
              {slide.options.length > 2 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    const newOptions = slide.options.filter((_, i) => i !== index)
                    onUpdate({ options: newOptions })
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const newOption = {
              id: `option_${Date.now()}`,
              text: ''
            }
            onUpdate({ options: [...slide.options, newOption] })
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="allowMultiple"
          checked={slide.allowMultiple}
          onCheckedChange={(checked) => onUpdate({ allowMultiple: checked as boolean })}
        />
        <Label htmlFor="allowMultiple">Allow multiple selections</Label>
      </div>
    </>
  )

  const renderWordCloudEditor = (slide: WordCloudSlide) => (
    <>
      <div className="space-y-2">
        <Label>Prompt</Label>
        <Textarea
          value={slide.prompt}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          placeholder="What would you like participants to share?"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Max Words per Person</Label>
        <Input
          type="number"
          value={slide.maxWords || 3}
          onChange={(e) => onUpdate({ maxWords: parseInt(e.target.value) })}
          min={1}
          max={10}
        />
      </div>
    </>
  )

  const renderQAEditor = (slide: QASlide) => (
    <>
      <div className="space-y-2">
        <Label>Prompt</Label>
        <Textarea
          value={slide.prompt}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          placeholder="What questions would you like to receive?"
          rows={3}
        />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="allowUpvoting"
            checked={slide.allowUpvoting}
            onCheckedChange={(checked) => onUpdate({ allowUpvoting: checked as boolean })}
          />
          <Label htmlFor="allowUpvoting">Allow upvoting</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="moderationEnabled"
            checked={slide.moderationEnabled}
            onCheckedChange={(checked) => onUpdate({ moderationEnabled: checked as boolean })}
          />
          <Label htmlFor="moderationEnabled">Enable moderation</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="anonymousAllowed"
            checked={slide.anonymousAllowed}
            onCheckedChange={(checked) => onUpdate({ anonymousAllowed: checked as boolean })}
          />
          <Label htmlFor="anonymousAllowed">Allow anonymous questions</Label>
        </div>
      </div>
    </>
  )

  const renderPollEditor = (slide: PollSlide) => (
    <>
      <div className="space-y-2">
        <Label>Question</Label>
        <Textarea
          value={slide.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your poll question"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {slide.options.map((option, index) => (
            <div key={option.id} className="flex gap-2">
              <Input
                value={option.text}
                onChange={(e) => {
                  const newOptions = [...slide.options]
                  newOptions[index] = { ...option, text: e.target.value }
                  onUpdate({ options: newOptions })
                }}
                placeholder={`Option ${index + 1}`}
              />
              {slide.options.length > 2 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    const newOptions = slide.options.filter((_, i) => i !== index)
                    onUpdate({ options: newOptions })
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            const newOption = {
              id: `option_${Date.now()}`,
              text: '',
              color: `#${Math.floor(Math.random()*16777215).toString(16)}`
            }
            onUpdate({ options: [...slide.options, newOption] })
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="showResultsLive"
          checked={slide.showResultsLive}
          onCheckedChange={(checked) => onUpdate({ showResultsLive: checked as boolean })}
        />
        <Label htmlFor="showResultsLive">Show results live</Label>
      </div>
    </>
  )

  const renderOpenTextEditor = (slide: OpenTextSlide) => (
    <>
      <div className="space-y-2">
        <Label>Prompt</Label>
        <Textarea
          value={slide.prompt}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          placeholder="What would you like participants to share?"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Length</Label>
          <Input
            type="number"
            value={slide.minLength || 0}
            onChange={(e) => onUpdate({ minLength: parseInt(e.target.value) })}
            min={0}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Length</Label>
          <Input
            type="number"
            value={slide.maxLength || 500}
            onChange={(e) => onUpdate({ maxLength: parseInt(e.target.value) })}
            min={1}
          />
        </div>
      </div>
    </>
  )

  const renderRatingEditor = (slide: RatingSlide) => (
    <>
      <div className="space-y-2">
        <Label>Question</Label>
        <Textarea
          value={slide.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="What would you like to rate?"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>Min Value</Label>
          <Input
            type="number"
            value={slide.minValue}
            onChange={(e) => onUpdate({ minValue: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Max Value</Label>
          <Input
            type="number"
            value={slide.maxValue}
            onChange={(e) => onUpdate({ maxValue: parseInt(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label>Step</Label>
          <Input
            type="number"
            value={slide.step}
            onChange={(e) => onUpdate({ step: parseFloat(e.target.value) })}
            step="0.1"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Min Label</Label>
          <Input
            value={slide.labels?.min || ''}
            onChange={(e) => onUpdate({ 
              labels: { ...slide.labels, min: e.target.value } 
            })}
            placeholder="e.g., Strongly Disagree"
          />
        </div>
        <div className="space-y-2">
          <Label>Max Label</Label>
          <Input
            value={slide.labels?.max || ''}
            onChange={(e) => onUpdate({ 
              labels: { ...slide.labels, max: e.target.value } 
            })}
            placeholder="e.g., Strongly Agree"
          />
        </div>
      </div>
    </>
  )

  const renderTriviaEditor = (slide: TriviaSlide) => (
    <>
      <div className="space-y-2">
        <Label>Question</Label>
        <Textarea
          value={slide.question}
          onChange={(e) => onUpdate({ question: e.target.value })}
          placeholder="Enter your trivia question"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Options</Label>
        <div className="space-y-2">
          {slide.options.map((option, index) => (
            <div key={option.id} className="flex gap-2 items-center">
              <Input
                value={option.text}
                onChange={(e) => {
                  const newOptions = [...slide.options]
                  newOptions[index] = { ...option, text: e.target.value }
                  onUpdate({ options: newOptions })
                }}
                placeholder={`Option ${index + 1}`}
              />
              <input
                type="radio"
                name="correctAnswer"
                checked={slide.correctAnswer === option.id}
                onChange={() => onUpdate({ correctAnswer: option.id })}
                className="w-4 h-4"
              />
              {slide.options.length > 2 && (
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    const newOptions = slide.options.filter((_, i) => i !== index)
                    onUpdate({ options: newOptions })
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const newOption = { 
              id: Math.random().toString(36).substr(2, 9), 
              text: ''
            }
            onUpdate({ options: [...slide.options, newOption] })
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Points</Label>
          <Input
            type="number"
            value={slide.points}
            onChange={(e) => onUpdate({ points: parseInt(e.target.value) })}
            min={0}
          />
        </div>
        <div className="space-y-2">
          <Label>Difficulty</Label>
          <Select value={slide.difficulty} onValueChange={(value) => onUpdate({ difficulty: value as 'easy' | 'medium' | 'hard' })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Category</Label>
        <Input
          value={slide.category || ''}
          onChange={(e) => onUpdate({ category: e.target.value })}
          placeholder="e.g., Geography, History, Science"
        />
      </div>
      <div className="space-y-2">
        <Label>Hint (optional)</Label>
        <Input
          value={slide.hint || ''}
          onChange={(e) => onUpdate({ hint: e.target.value })}
          placeholder="Give participants a helpful hint"
        />
      </div>
      <div className="space-y-2">
        <Label>Explanation (shown after answer)</Label>
        <Textarea
          value={slide.explanation || ''}
          onChange={(e) => onUpdate({ explanation: e.target.value })}
          placeholder="Explain the correct answer"
          rows={2}
        />
      </div>
    </>
  )

  const renderIceBreakerEditor = (slide: IceBreakerSlide) => (
    <>
      <div className="space-y-2">
        <Label>Prompt</Label>
        <Textarea
          value={slide.prompt}
          onChange={(e) => onUpdate({ prompt: e.target.value })}
          placeholder="Enter your ice breaker prompt"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Question Type</Label>
        <Select value={slide.questionType} onValueChange={(value) => onUpdate({ questionType: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="would_you_rather">Would You Rather</SelectItem>
            <SelectItem value="two_truths_one_lie">Two Truths and a Lie</SelectItem>
            <SelectItem value="fun_fact">Fun Fact</SelectItem>
            <SelectItem value="this_or_that">This or That</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(slide.questionType === 'would_you_rather' || slide.questionType === 'this_or_that') && slide.options && (
        <div className="space-y-2">
          <Label>Options</Label>
          <div className="space-y-2">
            {slide.options.map((option, index) => (
              <div key={option.id} className="flex gap-2">
                <Input
                  value={option.text}
                  onChange={(e) => {
                    const newOptions = [...slide.options!]
                    newOptions[index] = { ...option, text: e.target.value }
                    onUpdate({ options: newOptions })
                  }}
                  placeholder={`Option ${index + 1}`}
                />
                <Input
                  value={option.emoji || ''}
                  onChange={(e) => {
                    const newOptions = [...slide.options!]
                    newOptions[index] = { ...option, emoji: e.target.value }
                    onUpdate({ options: newOptions })
                  }}
                  placeholder="Emoji"
                  className="w-20"
                />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Checkbox
            id="allowComments"
            checked={slide.allowComments}
            onCheckedChange={(checked) => onUpdate({ allowComments: checked as boolean })}
          />
          <Label htmlFor="allowComments">Allow participants to add comments</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="showNames"
            checked={slide.showNames}
            onCheckedChange={(checked) => onUpdate({ showNames: checked as boolean })}
          />
          <Label htmlFor="showNames">Show participant names</Label>
        </div>
      </div>
    </>
  )

  const renderTeamChallengeEditor = (slide: TeamChallengeSlide) => (
    <>
      <div className="space-y-2">
        <Label>Challenge</Label>
        <Textarea
          value={slide.challenge}
          onChange={(e) => onUpdate({ challenge: e.target.value })}
          placeholder="Describe the team challenge"
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label>Challenge Type</Label>
        <Select value={slide.challengeType} onValueChange={(value) => onUpdate({ challengeType: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="creative">Creative</SelectItem>
            <SelectItem value="problem_solving">Problem Solving</SelectItem>
            <SelectItem value="speed">Speed</SelectItem>
            <SelectItem value="knowledge">Knowledge</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Teams (comma separated)</Label>
        <Input
          value={slide.teams?.join(', ') || ''}
          onChange={(e) => onUpdate({ teams: e.target.value.split(',').map(t => t.trim()).filter(t => t) })}
          placeholder="Team A, Team B, Team C"
        />
      </div>
      <div className="space-y-2">
        <Label>Scoring Method</Label>
        <Select value={slide.scoringMethod} onValueChange={(value) => onUpdate({ scoringMethod: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="points">Points</SelectItem>
            <SelectItem value="voting">Voting</SelectItem>
            <SelectItem value="time">Time-based</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {slide.scoringMethod === 'points' && (
        <div className="space-y-2">
          <Label>Max Points</Label>
          <Input
            type="number"
            value={slide.maxPoints || 100}
            onChange={(e) => onUpdate({ maxPoints: parseInt(e.target.value) })}
            min={0}
          />
        </div>
      )}
    </>
  )

  const renderLeaderboardEditor = (slide: LeaderboardSlide) => (
    <>
      <div className="space-y-2">
        <Label>Number of entries to show</Label>
        <Input
          type="number"
          value={slide.showTop || 10}
          onChange={(e) => onUpdate({ showTop: parseInt(e.target.value) })}
          min={1}
          max={100}
        />
      </div>
      <div className="space-y-2">
        <Label>Display Mode</Label>
        <Select value={slide.displayMode} onValueChange={(value) => onUpdate({ displayMode: value as 'individual' | 'team' })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="individual">Individual</SelectItem>
            <SelectItem value="team">Team</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="animateReveal"
          checked={slide.animateReveal}
          onCheckedChange={(checked) => onUpdate({ animateReveal: checked as boolean })}
        />
        <Label htmlFor="animateReveal">Animate reveal</Label>
      </div>
    </>
  )

  const renderSlideTypeEditor = () => {
    switch (slide.type) {
      case SlideType.TITLE:
        return renderTitleSlideEditor(slide as TitleSlide)
      case SlideType.MULTIPLE_CHOICE:
        return renderMultipleChoiceEditor(slide as MultipleChoiceSlide)
      case SlideType.WORD_CLOUD:
        return renderWordCloudEditor(slide as WordCloudSlide)
      case SlideType.QA:
        return renderQAEditor(slide as QASlide)
      case SlideType.POLL:
        return renderPollEditor(slide as PollSlide)
      case SlideType.OPEN_TEXT:
        return renderOpenTextEditor(slide as OpenTextSlide)
      case SlideType.RATING:
        return renderRatingEditor(slide as RatingSlide)
      case SlideType.TRIVIA:
        return renderTriviaEditor(slide as TriviaSlide)
      case SlideType.ICE_BREAKER:
        return renderIceBreakerEditor(slide as IceBreakerSlide)
      case SlideType.TEAM_CHALLENGE:
        return renderTeamChallengeEditor(slide as TeamChallengeSlide)
      case SlideType.LEADERBOARD:
        return renderLeaderboardEditor(slide as LeaderboardSlide)
      default:
        return null
    }
  }

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Edit Slide</span>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Settings className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Common Fields */}
        <div className="space-y-2">
          <Label>Slide Title</Label>
          <Input
            value={slide.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Slide Title"
          />
        </div>

        {/* Type-specific fields */}
        {renderSlideTypeEditor()}

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <h4 className="font-medium text-sm">Advanced Settings</h4>
            <div className="space-y-2">
              <Label>Time Limit (seconds)</Label>
              <Input
                type="number"
                value={slide.timeLimit || ''}
                onChange={(e) => onUpdate({ 
                  timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="No limit"
                min={0}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}