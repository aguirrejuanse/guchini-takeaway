import type { Order } from "@/lib/store";
import { branchById } from "@/lib/data";
import { formatARS } from "@/lib/format";

export function WaBubble({ order, ready }: { order: Order; ready?: boolean }) {
  const branch = branchById(order.branchId);
  return (
    <div className="rounded-xl bg-[#e7ffd8] p-3">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-cocoa">
        WhatsApp · vista previa
      </p>
      <div className="max-w-xs rounded-lg rounded-tl-none bg-white p-3 text-[13px] leading-snug shadow-sm">
        <p className="font-bold">🥪 Guchini</p>
        {ready ? (
          <p className="mt-1 font-semibold">
            ¡Tu pedido #{order.number} está listo!
          </p>
        ) : (
          <p className="mt-1 font-semibold">
            ¡Tu pedido #{order.number} fue confirmado!
          </p>
        )}
        <p className="mt-1 text-cocoa">Sucursal: {branch.name}</p>
        <p className="mt-1">
          {order.items.map((i) => (
            <span key={i.productId} className="block">
              {i.qty}x {i.name}
            </span>
          ))}
        </p>
        <p className="mt-1 font-bold">Total: {formatARS(order.total)}</p>
        {!ready ? (
          <p className="mt-1 text-cocoa">Te avisamos cuando esté listo.</p>
        ) : (
          <p className="mt-1 text-cocoa">Te esperamos para retirarlo. 🏃</p>
        )}
        <p className="mt-1 text-right text-[10px] text-cocoa">✓✓</p>
      </div>
    </div>
  );
}
