import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

type VoteChoice = 'yes' | 'no';

export interface VotePreviewProps {
  voteYesLabel: string;
  voteNoLabel: string;
  publicLabel: string;
  privateLabel: string;
  consentText: string;
  submitLabel: string;
  onSubmit: (vote: VoteChoice, isPublic: boolean) => void;
  className?: string;
}

export function VotePreview({
  voteYesLabel,
  voteNoLabel,
  publicLabel,
  privateLabel,
  consentText,
  submitLabel,
  onSubmit,
  className,
}: VotePreviewProps) {
  const [selectedVote, setSelectedVote] = useState<VoteChoice | null>(null);
  const [isPublic, setIsPublic] = useState(true);

  return (
    <div className={className ?? 'space-y-4'}>
      <div className="flex gap-3">
        <Button
          variant={selectedVote === 'yes' ? 'default' : 'outline'}
          className="flex-1 h-12"
          onClick={() => setSelectedVote('yes')}
        >
          {voteYesLabel}
        </Button>
        <Button
          variant={selectedVote === 'no' ? 'default' : 'outline'}
          className="flex-1 h-12"
          onClick={() => setSelectedVote('no')}
        >
          {voteNoLabel}
        </Button>
      </div>

      {selectedVote && (
        <div className="space-y-3 animate-fade-in">
          <div className="flex items-center justify-between p-3 bg-muted rounded-md">
            <Label htmlFor="public-vote" className="cursor-pointer">
              {isPublic ? publicLabel : privateLabel}
            </Label>
            <Switch
              id="public-vote"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
          {isPublic && (
            <p className="text-xs text-muted-foreground">{consentText}</p>
          )}
          <Button
            className="w-full h-12"
            onClick={() => selectedVote && onSubmit(selectedVote, isPublic)}
          >
            {submitLabel}
          </Button>
        </div>
      )}
    </div>
  );
}


