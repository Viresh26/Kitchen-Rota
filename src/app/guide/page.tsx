'use client';

import { Card } from '@/components/ui/Card';

const cleaningAgents = [
  {
    name: 'Grillfix',
    purpose: 'Electric stove and oven',
    instructions: 'Apply to the surface, let it sit for a few minutes, then wipe off with a damp cloth. For stubborn stains, use a scrubbing pad.',
    caution: 'Avoid contact with skin and eyes. Use in a well-ventilated area.',
  },
  {
    name: 'Glasreiniger',
    purpose: 'Microwave glass plate and windows',
    instructions: 'Spray directly on the surface and wipe with a clean, lint-free cloth or paper towel.',
  },
  {
    name: 'Allzweckreiniger (All-purpose cleaner)',
    purpose: 'Countertops, dining table, and general surfaces',
    instructions: 'Dilute in water or spray directly (depending on the product). Wipe with a sponge or cloth.',
  },
];

export default function CleaningGuidePage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Cleaning Guide</h1>
        <p className="text-neutral-600 mt-1">Instructions on which Reiniger to use and how to use them.</p>
      </div>

      <div className="flex flex-col gap-6">
        {cleaningAgents.map((agent) => (
          <Card key={agent.name} title={agent.name}>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Purpose</p>
                <p className="text-neutral-900 font-medium">{agent.purpose}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Instructions</p>
                <p className="text-sm text-neutral-600 leading-relaxed">{agent.instructions}</p>
              </div>
              {agent.caution && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                  <div className="flex gap-2 text-yellow-800">
                    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="text-xs">{agent.caution}</p>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <div className="flex items-start gap-4 p-2">
          <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-neutral-900">General House Rules</h3>
            <div className="text-sm text-neutral-600 mt-2 space-y-3">
              <p>
                <strong>Immediate Cleanup:</strong> Please always clean up after yourself immediately after using the kitchen. 
                Do not leave the cooking area until it is tidy and ready for the next person.
              </p>
              <p>
                <strong>Counter Management:</strong> Avoid leaving dirty utensils, dishes, or items with food remains on the 
                countertops for prolonged periods. Clear the workspace as soon as you are done.
              </p>
              <p className="text-xs pt-2 italic border-t border-neutral-100">
                Maintaining a clean kitchen is a shared responsibility!
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
