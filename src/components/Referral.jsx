
import React, { useContext,   useState } from 'react';
import {
  Copy,
  Check,
  Users,
  UserPlus,
  Share2,
  MessageCircle,
  Send,
//   Facebook,
  ExternalLink,
  Link as LinkIcon
} from 'lucide-react';

import { AppContext } from '../context/AppContext';

export default function Referral() {
  const { currentUser } = useContext(AppContext);

  const [copied, setCopied] = useState(false);

  /*
   * Backend se referralCode / userId jo available ho
   * usko use karenge.
   *
   * Expected:
   * currentUser.userId = "UN10001"
   * OR
   * currentUser.referralCode = "UN10001"
   */

  const referralCode =
    currentUser?.referralCode ||
    currentUser?.userId ||
    currentUser?.userid ||
    currentUser?.user_id ||
    currentUser?.referrerCode ||
    currentUser?.id ||
    '';

  const referralLink = referralCode
    ? `${window.location.origin}/register?ref=${encodeURIComponent(
        referralCode
      )}`
    : '';

  const copyReferralLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error('Copy referral link error:', error);
    }
  };

  const shareWhatsApp = () => {
    if (!referralLink) return;

    const text = `Join me on Unity Nivo using my referral link:\n${referralLink}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const shareTelegram = () => {
    if (!referralLink) return;

    const text = 'Join me on Unity Nivo';

    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(
        referralLink
      )}&text=${encodeURIComponent(text)}`,
      '_blank'
    );
  };

  const shareFacebook = () => {
    if (!referralLink) return;

    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        referralLink
      )}`,
      '_blank'
    );
  };

  const shareNative = async () => {
    if (!referralLink) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Unity Nivo',
          text: 'Join Unity Nivo using my referral link',
          url: referralLink
        });
      } catch (error) {
        if (error?.name !== 'AbortError') {
          console.error('Share error:', error);
        }
      }
    } else {
      copyReferralLink();
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          Referral
        </h1>

        <p className="mt-1 text-sm text-gray-400">
          Share your referral link and grow your network.
        </p>
      </div>

      {/* Main Referral Card */}
     <div
  className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 via-white/[0.03] to-transparent p-6 shadow-xl"
>
  <div
    className="absolute -top-20 -right-20 w-48 h-48 rounded-full bg-gold/10 blur-3xl"
  />

  <div className="relative">


          <div className="flex items-center gap-3 mb-6">
            <div className="
              flex items-center justify-center
              w-12 h-12
              rounded-xl
              bg-gold/10
              border border-gold/20
              text-gold
            ">
              <Share2 size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Your Referral Link
              </h2>

              <p className="text-xs text-gray-400">
                Share this link with your friends
              </p>
            </div>
          </div>

          {/* User ID */}
          <div className="mb-5">

            <label className="block mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              My User ID / Referral Code
            </label>

            <div className="
              flex items-center
              px-4 py-3
              rounded-xl
              bg-black/30
              border border-white/10
            ">
              <span className="font-bold text-gold">
                {referralCode || 'Not available'}
              </span>
            </div>

          </div>

          {/* Referral Link */}
          <div>

            <label className="block mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Personal Referral Link
            </label>

            <div className="
              flex flex-col sm:flex-row
              gap-2
            ">

              <div className="
                flex items-center flex-1
                min-w-0
                px-4 py-3
                rounded-xl
                bg-black/30
                border border-white/10
              ">

                <LinkIcon
                  size={16}
                  className="mr-3 text-gray-500 flex-shrink-0"
                />

                <span className="
                  text-sm
                  text-gray-300
                  truncate
                ">
                  {referralLink || 'Referral link unavailable'}
                </span>

              </div>

              <button
                onClick={copyReferralLink}
                disabled={!referralLink}
                className="
                  flex items-center justify-center
                  gap-2
                  px-5 py-3
                  rounded-xl
                  bg-gold
                  hover:bg-gold-light
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                  text-black
                  font-bold
                  text-sm
                  transition-all
                "
              >
                {copied ? (
                  <>
                    <Check size={17} />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy size={17} />
                    Copy Link
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Social Share */}
          <div className="mt-6">

            <p className="mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Share With
            </p>

            <div className="flex flex-wrap gap-3">

              <button
                onClick={shareWhatsApp}
                disabled={!referralLink}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-green-500/10
                  border border-green-500/20
                  text-green-400
                  hover:bg-green-500/20
                  disabled:opacity-40
                  transition
                "
              >
                <MessageCircle size={17} />
                WhatsApp
              </button>

              <button
                onClick={shareTelegram}
                disabled={!referralLink}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-sky-500/10
                  border border-sky-500/20
                  text-sky-400
                  hover:bg-sky-500/20
                  disabled:opacity-40
                  transition
                "
              >
                <Send size={17} />
                Telegram
              </button>

              <button
                onClick={shareFacebook}
                disabled={!referralLink}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-blue-500/10
                  border border-blue-500/20
                  text-blue-400
                  hover:bg-blue-500/20
                  disabled:opacity-40
                  transition
                "
              >
                {/* <Facebook size={17} /> */}
                Facebook
              </button>

              <button
                onClick={shareNative}
                disabled={!referralLink}
                className="
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-xl
                  bg-white/5
                  border border-white/10
                  text-gray-300
                  hover:bg-white/10
                  disabled:opacity-40
                  transition
                "
              >
                <ExternalLink size={17} />
                More
              </button>

            </div>
          </div>

        </div>
      </div>

      {/* Referral Stats */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-4
      ">

        <div className="
          p-5
          rounded-2xl
          bg-white/[0.03]
          border border-white/10
        ">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-gray-500 uppercase">
                Total Referrals
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                0
              </p>
            </div>

            <Users className="text-gold" size={24} />
          </div>
        </div>

        <div className="
          p-5
          rounded-2xl
          bg-white/[0.03]
          border border-white/10
        ">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-gray-500 uppercase">
                Active Referrals
              </p>

              <p className="mt-2 text-2xl font-bold text-white">
                0
              </p>
            </div>

            <UserPlus className="text-emerald-400" size={24} />
          </div>
        </div>

        <div className="
          p-5
          rounded-2xl
          bg-white/[0.03]
          border border-white/10
        ">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs text-gray-500 uppercase">
                Referral Income
              </p>

              <p className="mt-2 text-2xl font-bold text-gold">
                $0.00
              </p>
            </div>

            <Share2 className="text-gold" size={24} />
          </div>
        </div>

      </div>

    </div>  
  );
}
