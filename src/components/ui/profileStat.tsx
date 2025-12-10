/* eslint-disable @typescript-eslint/no-explicit-any */
export default function ProfileStat({ label, value }: { label: string; value: any }) {
  return (
    <div className="p-4 border rounded-xl text-center bg-card">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
