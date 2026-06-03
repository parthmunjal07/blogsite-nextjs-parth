"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/profile";

type UserData = {
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
};

export default function ProfileEditForm({ user }: { user: UserData }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <div className="bg-surface border border-outline-variant rounded-lg p-6 max-w-2xl">
      <h2 className="font-headline-md text-headline-md text-on-surface mb-6 border-b border-outline-variant pb-2">
        Edit Profile
      </h2>

      {state?.message && (
        <div className="mb-6 p-4 rounded bg-[#e6f4ea] text-[#137333] border border-[#ceead6] font-body-md text-body-md">
          {state.message}
        </div>
      )}
      
      {state?.error && (
        <div className="mb-6 p-4 rounded bg-error-container text-on-error-container font-body-md text-body-md">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-6">
        <div>
          <label htmlFor="username" className="block font-label-md text-label-md text-on-surface mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            defaultValue={user.username || ""}
            className="w-full bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
            required
            minLength={3}
          />
          <p className="mt-1 font-caption text-caption text-on-surface-variant">
            This is your unique display name and URL handle.
          </p>
        </div>

        <div>
          <label htmlFor="bio" className="block font-label-md text-label-md text-on-surface mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={user.bio || ""}
            className="w-full bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow min-h-[100px] resize-y"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div>
          <label htmlFor="avatarUrl" className="block font-label-md text-label-md text-on-surface mb-1">
            Avatar URL
          </label>
          <input
            type="url"
            id="avatarUrl"
            name="avatarUrl"
            defaultValue={user.avatarUrl || ""}
            className="w-full bg-surface border border-outline-variant rounded px-3 py-2 text-on-surface font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow"
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div className="pt-4 border-t border-outline-variant flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="bg-primary hover:bg-on-primary-fixed-variant disabled:opacity-50 text-on-primary font-label-md text-label-md px-6 py-2 rounded transition-colors"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
