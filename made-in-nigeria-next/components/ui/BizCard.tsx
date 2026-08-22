import Link from 'next/link';
import { ReactNode } from 'react';

interface BizCardProps {
  href: string;
  thumbClassName: string; // e.g. "thumb-1" through "thumb-6" — see globals.css gradient variants
  badge?: ReactNode;
  title: string;
  meta: string;
  footer?: ReactNode;
}

/**
 * Covers the .biz-card pattern used for business listings, products, and (with
 * footer omitted) professionals. Real thumbnail images replace the gradient
 * `thumbClassName` placeholders once product/business photo uploads exist.
 */
export default function BizCard({ href, thumbClassName, badge, title, meta, footer }: BizCardProps) {
  return (
    <Link href={href} className="biz-card">
      <div className={`biz-thumb ${thumbClassName}`}>{badge}</div>
      <div className="biz-body">
        <h4>{title}</h4>
        <div className="biz-meta">{meta}</div>
        {footer}
      </div>
    </Link>
  );
}
