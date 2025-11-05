import { useState } from 'react';
import { Share2, Link2, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SharePanelProps {
  pollId: string;
  pollTitle: string;
  language: 'en' | 'hr';
}

export function SharePanel({ pollId, pollTitle, language }: SharePanelProps) {
  const { toast } = useToast();

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      en: {
        title: 'Share This Poll',
        copyLink: 'Copy Link',
        linkCopied: 'Link copied to clipboard',
      },
      hr: {
        title: 'Podijeli Ovu Anketu',
        copyLink: 'Kopiraj Link',
        linkCopied: 'Link kopiran u međuspremnik',
      },
    };
    return translations[language][key] || key;
  };

  const pollUrl = `${window.location.origin}${import.meta.env.BASE_URL}poll/${pollId}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(pollUrl);
      toast({
        title: t('linkCopied'),
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleShare = (platform: string) => {
    const encodedUrl = encodeURIComponent(pollUrl);
    const encodedTitle = encodeURIComponent(pollTitle);

    let shareUrl = '';
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=600');
    }
  };

  const shareButtons = [
    { id: 'whatsapp', icon: MessageCircle, label: 'WhatsApp', color: 'hover:bg-green-500/10 hover:text-green-600' },
    { id: 'facebook', icon: Facebook, label: 'Facebook', color: 'hover:bg-blue-500/10 hover:text-blue-600' },
    { id: 'linkedin', icon: Linkedin, label: 'LinkedIn', color: 'hover:bg-blue-700/10 hover:text-blue-700' },
  ];

  return (
    <section className="bg-card border border-border rounded-md p-6 mb-6">
      <h2 className="text-lg font-bold mb-4">{t('title')}</h2>
      <div className="flex flex-wrap gap-2">
        {shareButtons.map(btn => {
          const Icon = btn.icon;
          return (
            <Button
              key={btn.id}
              variant="outline"
              size="sm"
              onClick={() => handleShare(btn.id)}
              className={`flex items-center gap-2 ${btn.color}`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{btn.label}</span>
            </Button>
          );
        })}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="flex items-center gap-2"
        >
          <Link2 className="h-4 w-4" />
          <span className="hidden sm:inline">{t('copyLink')}</span>
        </Button>
      </div>
    </section>
  );
}
