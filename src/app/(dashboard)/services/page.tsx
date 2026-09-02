import { ServiceContainer } from "@/features/service/service-container";

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Serviços</h1>
      </div>

      <ServiceContainer />
    </div>
  );
}
