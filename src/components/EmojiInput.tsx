interface Props {
  value: string;
  onChange: (emoji: string) => void;
}

const POPULAR_EMOJIS = [
  '😀','😎','🔥','⚡','🚀','💡','🎯','🎨','🎮','🎵',
  '🎬','📱','💻','🖥️','⌨️','📝','📊','📈','🔧','⚙️',
  '🛠️','🔑','🔒','🌟','⭐','💎','🏆','❤️','💜','💙',
  '💚','💛','🧡','🤖','👾','🎃','🦊','🐱','🐶','🌈',
  '🌍','🌙','☀️','🍕','☕','🍜','🎸','🎲','🧩','🪐',
];

export default function EmojiInput({ value, onChange }: Props) {
  return (
    <div className="space-y-3">
      {/* Custom emoji input */}
      <div>
        <label className="block text-sm text-neutral-400 mb-1">
          Type or paste emoji
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-neutral-800 border border-neutral-600 rounded px-3 py-2 text-2xl text-center"
          maxLength={4}
        />
      </div>

      {/* Quick-pick grid */}
      <div>
        <label className="block text-sm text-neutral-400 mb-1">
          Quick pick
        </label>
        <div className="grid grid-cols-10 gap-1">
          {POPULAR_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onChange(emoji)}
              className={`text-xl p-1 rounded hover:bg-neutral-700 transition-colors ${
                value === emoji ? 'bg-neutral-700 ring-1 ring-blue-500' : ''
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
