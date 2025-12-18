import { FinalizePost } from './FinalizePost';
import { ConnectionRequiredModal } from './ConnectionRequiredModal';

export function ConnectionModalDemo() {
  return (
    <div className="relative h-full w-full">
      {/* Background Screen - Finalize Post */}
      <FinalizePost />

      {/* Modal Overlay */}
      <ConnectionRequiredModal
        platform="Instagram"
        isOpen={true}
        onConnect={() => console.log('Connect clicked')}
        onCancel={() => console.log('Cancel clicked')}
      />
    </div>
  );
}
