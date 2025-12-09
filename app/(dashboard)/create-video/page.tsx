import { Suspense } from 'react';
import CreateVideoForm from './CreateVideoForm';

export default function CreateVideoPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateVideoForm />
    </Suspense>
  );
}
