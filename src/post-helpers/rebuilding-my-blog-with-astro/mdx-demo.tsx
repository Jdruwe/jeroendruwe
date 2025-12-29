import React from 'react';
import { Button } from '@/components/ui/button.tsx';
import { Space } from '@/components/ui/space.tsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog.tsx';

const MdxDemo = () => {
  return (
    <Space className="grid place-items-center">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Free Bitcoins 💰</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Never Gonna Give You Up</DialogTitle>
          </DialogHeader>
          <iframe
            className="aspect-video"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=7B0aWTM2Q9yb2EsQ&autoplay=1&mute=1"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </DialogContent>
      </Dialog>
    </Space>
  );
};

export { MdxDemo };
