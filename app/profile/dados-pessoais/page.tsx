"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import Image from "next/image";

export default function DadosPessoaisPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-5 w-5 rounded-full border-2 border-[#E8612B] border-t-transparent animate-spin" />
      </div>
    );
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      await user.update({ firstName: firstName.trim(), lastName: lastName.trim() });
      if (pendingFile) {
        await user.setProfileImage({ file: pendingFile });
      }
      router.refresh();
      router.push("/profile");
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  const avatarSrc = previewUrl ?? user?.imageUrl;
  const initials = (user?.firstName?.[0] ?? "A").toUpperCase();
  const hasChanges =
    firstName.trim() !== (user?.firstName ?? "") ||
    lastName.trim() !== (user?.lastName ?? "") ||
    pendingFile !== null;

  return (
    <div className="px-4 pt-4 pb-4 max-w-lg mx-auto lg:max-w-none lg:px-6 lg:pt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-8 w-8 rounded-full text-[#9B978E] hover:text-[#F0EDE6] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <h1 className="text-[16px] font-medium text-[#F0EDE6]">Dados pessoais</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="relative group"
          aria-label="Alterar foto de perfil"
        >
          <div className="h-[72px] w-[72px] rounded-full overflow-hidden bg-[#E8612B] flex items-center justify-center text-[26px] font-medium text-white">
            {avatarSrc ? (
              <Image
                src={avatarSrc}
                alt="Foto de perfil"
                width={72}
                height={72}
                className="object-cover w-full h-full"
              />
            ) : (
              initials
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 text-[12px] text-[#E8612B] hover:text-[#d45422] transition-colors"
        >
          Alterar foto
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Form */}
      <div className="rounded-[10px] border border-white/[0.06] bg-[#141417] divide-y divide-white/[0.06] mb-4">
        <div className="px-4 py-3">
          <label className="block text-[11px] text-[#5E5C55] mb-1">Nome</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Seu nome"
            className="w-full bg-transparent text-[13px] text-[#F0EDE6] placeholder-[#5E5C55] outline-none"
          />
        </div>
        <div className="px-4 py-3">
          <label className="block text-[11px] text-[#5E5C55] mb-1">Sobrenome</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Seu sobrenome"
            className="w-full bg-transparent text-[13px] text-[#F0EDE6] placeholder-[#5E5C55] outline-none"
          />
        </div>
        <div className="px-4 py-3">
          <label className="block text-[11px] text-[#5E5C55] mb-1">Email</label>
          <p className="text-[13px] text-[#5E5C55]">
            {user?.primaryEmailAddress?.emailAddress ?? "—"}
          </p>
        </div>
      </div>

      {error && (
        <p className="text-[12px] text-[#E24B4A] mb-4">{error}</p>
      )}

      <button
        onClick={handleSave}
        disabled={saving || !hasChanges}
        className="w-full rounded-[8px] bg-[#E8612B] py-2.5 text-[13px] font-medium text-white transition-opacity disabled:opacity-40"
      >
        {saving ? "Salvando..." : "Salvar alterações"}
      </button>
    </div>
  );
}
