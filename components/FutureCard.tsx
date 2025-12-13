import React from 'react';
import { Sparkles } from 'lucide-react';

const FutureCard: React.FC = () => {
  return (
    <div className="h-full bg-gradient-to-br from-primary-50 to-white rounded-xl border border-dashed border-primary-200 flex flex-col items-center justify-center p-6 text-center shadow-sm min-h-[300px]">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-primary-100">
        <Sparkles className="w-8 h-8 text-primary-300 animate-pulse" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-2">更多作品加载中...</h3>
      <p className="text-sm text-gray-500 max-w-[200px]">
        小狼正在工坊里施展魔法
        <br />
        敬请期待下一件孤品
      </p>
    </div>
  );
};

export default FutureCard;