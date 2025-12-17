/**
 * Trust Indicators Component
 * Displays rating, customer count, and coverage badges
 */
export function TrustIndicators() {
  const indicators = [
    {
      icon: (
        <svg className="h-4 w-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      text: '4.8/5 Rating',
    },
    {
      icon: (
        <svg className="h-4 w-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      text: '10,000+ Customers',
    },
    {
      icon: (
        <svg className="h-4 w-4 text-accent-400" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
      text: 'UK-Wide Coverage',
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 lg:justify-start">
      {indicators.map((indicator, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm"
        >
          {indicator.icon}
          <span className="text-sm font-bold text-white">{indicator.text}</span>
        </div>
      ))}
    </div>
  );
}

