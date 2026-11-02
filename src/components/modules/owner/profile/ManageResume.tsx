"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { BASE_URL } from '@/lib/apiConfig';

interface ManageResumeProps {
  currentResumeUrl?: string;
}


export default function ManageResume({ currentResumeUrl }: ManageResumeProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file to upload.');
      return;
    }

    setIsUploading(true);
    const toastId = 'resume-upload';

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch(`${BASE_URL}/resume/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Resume uploaded successfully.', { id: toastId });
      } else {
        throw new Error(data.error || 'Failed to upload resume');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to upload resume', {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Manage Resume</h2>
      {currentResumeUrl && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Current Resume:</p>
          <a
            href={currentResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline inline-block text-sm"
          >
            View Current Resume
          </a>
        </div>
      )}
      <div className="space-y-2">
        <Input type="file" accept=".pdf" onChange={handleFileChange} />
        <Button onClick={handleUpload} disabled={isUploading || !file}>
          {isUploading ? 'Uploading...' : 'Upload Resume'}
        </Button>
      </div>
    </div>
  );
}
