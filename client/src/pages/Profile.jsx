import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { FiCamera } from "react-icons/fi";
import api from "../api/axios.js";
import useAuth from "../hooks/useAuth.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileForm, setProfileForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [profileErrors, setProfileErrors] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      setUploadingAvatar(true);
      try {
        const { data } = await api.put("/users/avatar", { image: reader.result });
        updateUser({ avatar: data.avatar });
        toast.success("Profile photo updated");
      } catch {
        toast.error("Could not upload photo");
      } finally {
        setUploadingAvatar(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const validateProfile = () => {
    const errs = {};
    if (!profileForm.name.trim()) errs.name = "Name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) errs.email = "Enter a valid email.";
    return errs;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const errs = validateProfile();
    setProfileErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSavingProfile(true);
    try {
      const { data } = await api.put("/users/profile", profileForm);
      updateUser(data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const validatePassword = () => {
    const errs = {};
    if (!passwordForm.currentPassword) errs.currentPassword = "Current password is required.";
    if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
      errs.newPassword = "New password must be at least 6 characters.";
    }
    if (passwordForm.confirmPassword !== passwordForm.newPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }
    return errs;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errs = validatePassword();
    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSavingPassword(true);
    try {
      await api.put("/users/password", passwordForm);
      toast.success("Password changed");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.delete("/users/account");
      toast.success("Account deleted");
      logout();
      navigate("/");
    } catch {
      toast.error("Could not delete account");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-2xl font-display font-bold">Profile</h2>

      <div className="card p-6 flex items-center gap-5">
        <div className="relative">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-500 text-white text-2xl font-semibold flex items-center justify-center">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <button
            onClick={handleAvatarClick}
            disabled={uploadingAvatar}
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center border-2 border-white dark:border-slate-900"
            aria-label="Upload new photo"
          >
            <FiCamera size={14} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
        <div>
          <p className="font-semibold">{user?.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleProfileSubmit} className="card p-6 space-y-4">
        <h3 className="font-semibold">Personal Information</h3>
        <div>
          <label className="label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            className="input"
            value={profileForm.name}
            onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))}
          />
          {profileErrors.name && <p className="error-text">{profileErrors.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={profileForm.email}
            onChange={(e) => setProfileForm((p) => ({ ...p, email: e.target.value }))}
          />
          {profileErrors.email && <p className="error-text">{profileErrors.email}</p>}
        </div>
        <button type="submit" className="btn-primary" disabled={savingProfile}>
          {savingProfile ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="card p-6 space-y-4">
        <h3 className="font-semibold">Change Password</h3>
        <div>
          <label className="label" htmlFor="currentPassword">
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            className="input"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))}
          />
          {passwordErrors.currentPassword && <p className="error-text">{passwordErrors.currentPassword}</p>}
        </div>
        <div>
          <label className="label" htmlFor="newPassword">
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            className="input"
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))}
          />
          {passwordErrors.newPassword && <p className="error-text">{passwordErrors.newPassword}</p>}
        </div>
        <div>
          <label className="label" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="input"
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))}
          />
          {passwordErrors.confirmPassword && <p className="error-text">{passwordErrors.confirmPassword}</p>}
        </div>
        <button type="submit" className="btn-primary" disabled={savingPassword}>
          {savingPassword ? "Updating..." : "Change Password"}
        </button>
      </form>

      <div className="card p-6 border-expense/30">
        <h3 className="font-semibold text-expense mb-1">Danger Zone</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Deleting your account permanently removes all your expenses and income records. This cannot be undone.
        </p>
        <button className="btn-danger" onClick={() => setDeleteOpen(true)}>
          Delete Account
        </button>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleting}
        title="Delete your account?"
        message="This will permanently delete your account and all associated data. This action cannot be undone."
        confirmLabel="Delete Account"
      />
    </div>
  );
}
