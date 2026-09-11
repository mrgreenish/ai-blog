import Link from "next/link";
import { AUTHOR_NAME, AUTHOR_URL } from "@/lib/siteConfig";
import { Arrow } from "@/components/ui/Arrow";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-shell">
        <div className="footer-top">
          <div>
            <p className="eyebrow">Keep a good thing going</p>
            <p className="footer-statement">
              Stay curious.
              <br />
              Build something good.
            </p>
          </div>
          <Link className="footer-rss" href="/feed.xml">
            Follow the field notes
            <Arrow diagonal />
            <span>Subscribe via RSS</span>
          </Link>
        </div>
        <div className="footer-bottom">
          <Link href="/" className="wordmark">
            AI Field Notes.
          </Link>
          <p>
            Written & built by <a href={AUTHOR_URL}>{AUTHOR_NAME}</a>
          </p>
          <span>© {new Date().getFullYear()}</span>
          <a href="#main">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
