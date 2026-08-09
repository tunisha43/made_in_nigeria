import Link from 'next/link';
import Tabs from '@/components/ui/Tabs';

export const metadata = {
  title: 'Events & Celebrations',
};

interface EventItem {
  day: string;
  month: string;
  thumb: string;
  typeLabel: string;
  title: string;
  location: string;
  time: string;
}

const EVENTS: EventItem[] = [
  { day: '14', month: 'AUG', thumb: 'thumb-2', typeLabel: 'Meetup', title: 'Aba Textile Makers — Meetup', location: 'Ariaria Market, Aba', time: '4:00 PM WAT' },
  { day: '22', month: 'AUG', thumb: 'thumb-3', typeLabel: 'Workshop', title: 'Export Readiness Workshop', location: 'Online', time: '10:00 AM WAT' },
  { day: '29', month: 'AUG', thumb: 'thumb-6', typeLabel: 'Business Shower', title: 'Uduak Beads & Craft — Business Shower', location: 'Uyo, Akwa Ibom', time: '12:00 PM WAT' },
  { day: '05', month: 'SEP', thumb: 'thumb-4', typeLabel: 'Grand Opening', title: "Josephine's Kitchen Co. — Second Location Opening", location: 'Ikeja, Lagos', time: '9:00 AM WAT' },
  { day: '12', month: 'SEP', thumb: 'thumb-5', typeLabel: 'Milestone', title: 'Okon Leather Works — 100 Orders Celebration', location: 'Port Harcourt, Rivers', time: '3:00 PM WAT' },
  { day: '20', month: 'SEP', thumb: 'thumb-1', typeLabel: 'Workshop', title: 'Pricing Your Product for Profit', location: 'Online', time: '11:00 AM WAT' },
];

function EventCard({ event }: { event: EventItem }) {
  return (
    <div className="event-card">
      <div className={`event-date-block ${event.thumb}`}>
        <div>
          <div className="event-date-num">{event.day}</div>
          <div className="event-date-mon">{event.month}</div>
        </div>
        <span className="badge" style={{ background: 'rgba(255,255,255,.18)', color: 'var(--cream)' }}>
          {event.typeLabel}
        </span>
      </div>
      <div className="event-body">
        <h4>{event.title}</h4>
        <div className="event-meta-row">📍 {event.location}</div>
        <div className="event-meta-row">🕓 {event.time}</div>
        <a href="#" className="btn btn-outline btn-sm">RSVP</a>
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <>
      <section className="page-header">
        <div className="wrap">
          <div className="eyebrow">Events & Celebrations</div>
          <h1>Every milestone deserves a witness</h1>
          <p>
            Workshops, meetups, and the celebrations that mark real progress — Business Showers,
            Grand Openings, and milestone moments shared with the community.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="banner" style={{ padding: 0, overflow: 'hidden' }}>
            <div className="featured-banner-grid">
              <div className="thumb-2" style={{ minHeight: 260 }} aria-hidden="true" />
              <div className="banner-inner">
                <div className="eyebrow hero-eyebrow">Featured · Aug 22</div>
                <h3>Export Readiness Workshop</h3>
                <p>
                  A hands-on session for businesses preparing their first international shipment —
                  documentation, pricing, and logistics, taught by Made in Nigeria&apos;s trade partners.
                </p>
                <a href="#" className="btn btn-gold">Reserve a Spot</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="wrap">
          <div className="section-head">
            <div>
              <div className="eyebrow">Upcoming</div>
              <h2>All events</h2>
            </div>
          </div>

          <Tabs
            tabs={[
              {
                key: 'all',
                label: 'All',
                panel: (
                  <div className="card-grid grid-3">
                    {EVENTS.map((event) => (
                      <EventCard event={event} key={event.title} />
                    ))}
                  </div>
                ),
              },
              {
                key: 'workshops',
                label: 'Workshops',
                panel: (
                  <div className="empty-state">
                    Filtering by Workshops — connect the live database to populate this view.
                  </div>
                ),
              },
              {
                key: 'celebrations',
                label: 'Celebrations',
                panel: (
                  <div className="empty-state">
                    Filtering by Celebrations — Business Showers, Openings, and Milestones will appear here.
                  </div>
                ),
              },
              {
                key: 'meetups',
                label: 'Meetups',
                panel: (
                  <div className="empty-state">
                    Filtering by Meetups — connect the live database to populate this view.
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="banner">
            <div className="banner-inner">
              <div className="eyebrow hero-eyebrow">Hosting Something?</div>
              <h3>Milestones are worth celebrating publicly.</h3>
              <p>
                Reached 100 orders? Opening a second location? Let the community celebrate it with
                you — submit your event and we&apos;ll help you spread the word.
              </p>
              <Link href="/auth?role=business" className="btn btn-gold">Submit an Event</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
