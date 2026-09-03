export function Footer() {
  return (
    <footer className="site-px border-t border-neutral-200 py-10 dark:border-neutral-800">
      <div className="flex flex-col items-start justify-between gap-4 text-sm text-neutral-500 sm:flex-row sm:items-center dark:text-neutral-400">
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
