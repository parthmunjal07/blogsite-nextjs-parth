import Link from "next/link";
import Image from "next/image";

export default function ProfilePage() {
  return (
    <main className="flex-grow w-full px-margin-page py-gap-section max-w-container-max mx-auto mt-8">
      {/* Profile Header */}
      <header className="flex flex-col items-center text-center space-y-gap-component mb-gap-section">
        <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-md text-headline-md font-bold">
          ES
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="font-headline-md text-headline-md font-normal text-on-surface">Eleanor Vance</h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-primary-container text-on-primary-container text-[11px] font-medium leading-none">
              Blog Creator
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">@eleanor_v</p>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md mx-auto">
            Writing about design, architecture, and the spaces between. Exploring minimalist living.
          </p>
        </div>
        <div className="flex items-center justify-center gap-2 font-caption text-caption text-on-surface-variant">
          <span>12 Posts</span>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <span>3 Drafts</span>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <span>Since Oct 2023</span>
        </div>
      </header>

      {/* Action Row */}
      <div className="flex items-center justify-between border-y border-outline-variant py-4 mb-gap-section">
        <Link href="/admin/posts/new" className="flex items-center gap-2 font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>edit_square</span>
          Write a new post
        </Link>
        <span className="font-label-md text-label-md text-on-surface-variant">Drafts (3)</span>
      </div>

      {/* Content Sections */}
      <div className="space-y-gap-section">
        {/* Drafts Section */}
        <section>
          <h2 className="font-label-md text-label-md text-on-surface mb-6 border-b border-outline-variant pb-2">Drafts</h2>
          <div className="space-y-6">
            {/* Draft Item */}
            <article className="flex justify-between items-start gap-4 p-4 border border-outline-variant rounded bg-surface">
              <div className="flex-grow">
                <h3 className="font-body-lg text-body-lg text-on-surface mb-1">The Psychology of Empty Space</h3>
                <p className="font-caption text-caption text-on-surface-variant">Last edited 2 days ago</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Edit</button>
                <button className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors">Publish</button>
              </div>
            </article>

            {/* Draft Item */}
            <article className="flex justify-between items-start gap-4 p-4 border border-outline-variant rounded bg-surface">
              <div className="flex-grow">
                <h3 className="font-body-lg text-body-lg text-on-surface mb-1">Urban Retreats: Finding Silence</h3>
                <p className="font-caption text-caption text-on-surface-variant">Last edited a week ago</p>
              </div>
              <div className="flex items-center gap-4">
                <button className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">Edit</button>
                <button className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant transition-colors">Publish</button>
              </div>
            </article>
          </div>
        </section>

        {/* Published Section */}
        <section>
          <h2 className="font-label-md text-label-md text-on-surface mb-6 border-b border-outline-variant pb-2">Published</h2>
          <div className="space-y-8">
            {/* Published Item */}
            <article className="flex flex-col sm:flex-row gap-6 group cursor-pointer">
              <div className="w-full sm:w-1/3 aspect-video sm:aspect-square bg-surface-variant border border-outline-variant rounded overflow-hidden relative">
                <img 
                  alt="A minimalist architectural interior" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity absolute inset-0" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPizWU8he2noIVV7jHPrbhHjR7cS90apvFyis10JtA5lB4NMhAnWLdmWJP-Nte10tdNKNXTqXInH45sVHb9U9tFgDzGPMGIxdwCNlbtoxUc5CNMzqscF3CfO6IpxEavpqAKl-XQnSP7T-UAa6jXBsOdWE4k7cCp98ueAWKgEs6VfOb6QMVOJdL6H2rqHgiuzZzNMt6Nd_8Wt54eF_tC4L7GY81VViVSG06PSBGROG1j2xEEXZkxMixYUU1q4_ksFQ-nc0dg2-1J-A"
                />
              </div>
              <div className="w-full sm:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-caption text-caption">Architecture</span>
                  <span className="font-caption text-caption text-on-surface-variant">Nov 12, 2023</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">Form and Function in the Modern Studio</h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">Exploring how intentional design choices can transform a small living space into a functional sanctuary.</p>
              </div>
            </article>

            {/* Published Item */}
            <article className="flex flex-col sm:flex-row gap-6 group cursor-pointer">
              <div className="w-full sm:w-1/3 aspect-video sm:aspect-square bg-surface-variant border border-outline-variant rounded overflow-hidden relative">
                <img 
                  alt="A quiet reading corner" 
                  className="w-full h-full object-cover grayscale opacity-80 group-hover:opacity-100 transition-opacity absolute inset-0" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCaQI14zeVl37i8rd2CXdXzHNEUOGh-3Tdw-Ju1XF5TF15cfc2lM_QkLoXrzaWj64OMUs50KifQXiAPqGGdKDSeue4B5H3C4yEMunzCXcSysfhxsGyODqjbB5vmsnHd6TSOONz1y1qGy4VRsXtxqIKjvoXok250_Q054qa1ndXUKpgqrQDybE_jKG4itX_NVjSn-ZwBVDu2IkUXJTu8PqHk_YsRxVmi-DJdpHLrszbcSKWFLz7x0_RiB-lYL7lpL6eI4zASo8M8yGU"
                />
              </div>
              <div className="w-full sm:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-caption text-caption">Lifestyle</span>
                  <span className="font-caption text-caption text-on-surface-variant">Oct 28, 2023</span>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-2 group-hover:text-primary transition-colors">Curating Your Reading Nook</h3>
                <p className="font-body-md text-body-md text-on-surface-variant line-clamp-2">A guide to selecting the right pieces to create an environment that fosters deep reading and reflection.</p>
              </div>
            </article>
          </div>
        </section>
      </div>
    </main>
  );
}
