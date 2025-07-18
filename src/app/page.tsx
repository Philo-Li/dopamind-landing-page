// src/app/page.tsx
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 text-gray-800">
      <div className="container mx-auto flex flex-col items-center px-4 py-12 text-center">
        {/* 你可以把你的 Logo 图片放在 public 文件夹下 */}
        {/* <img src="/dopamind-logo.png" alt="Dopamind Logo" className="w-24 h-24 mb-4" /> */}
        
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          重新定义你的专注与效率
        </h1>
        
        <p className="mt-6 text-lg leading-8 text-gray-600">
          通过 AI 对话和科学方法，让任务管理变得简单直观。
          <br />
          告别传统复杂的任务工具，享受专注带来的成就感。
        </p>
        
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-orange-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
          >
            立即体验
          </a>
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            了解功能 <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </main>
  );
}