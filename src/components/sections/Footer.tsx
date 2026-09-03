export function Footer() {
  return (
    <footer className="border-t border-neutral-200 px-6 py-10 sm:px-10">
      <div className="flex flex-col items-start justify-between gap-4 text-sm text-neutral-500 sm:flex-row sm:items-center">
        <p>Md. Maruf Bin Salim Bhuiyan — Dhaka, Bangladesh</p>
        <div className="flex gap-5">
          <a href="mailto:mdmarufbinsalim@gmail.com" className="hover:opacity-60">
            mdmarufbinsalim@gmail.com
          </a>
          <a href="tel:+8801726442155" className="hover:opacity-60">
            +880 1726 442155
          </a>
        </div>
      </div>
    </footer>
  );
}
