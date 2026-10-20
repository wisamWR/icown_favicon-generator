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
        <label className="block text-xs text-[#B5AAA0] font-medium mb-1">
          Type or paste emoji
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#1C1815] border border-[#2E2822] rounded-xl px-3 py-2 text-2xl text-center focus:border-[#ec4899] focus:ring-1 focus:ring-[#ec4899]"
          maxLength={4}
        />
      </div>

      {/* Quick-pick grid */}
      <div>
        <label className="block text-xs text-[#B5AAA0] font-medium mb-1">
          Quick pick
        </label>
        <div className="grid grid-cols-10 gap-1">
          {POPULAR_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => onChange(emoji)}
              className={`text-xl p-1 rounded-lg hover:bg-[#2B2420] transition-colors ${
                value === emoji ? 'bg-[#2B2420] ring-1 ring-[#ec4899]' : ''
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
