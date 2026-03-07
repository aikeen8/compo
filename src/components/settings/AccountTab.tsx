export function AccountTab() {
  return (
    <div className="max-w-xl pr-2">
      <h3 className="text-xl font-semibold mb-6 dark:text-white">My Account</h3>

      {/* email block */}
      <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 flex items-center justify-between transition-colors">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email address</p>
          <p className="font-medium text-slate-800 dark:text-slate-200">you@example.com</p>
        </div>
        <button className="bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
          Edit
        </button>
      </div>

      <div className="mb-8 border-t border-slate-200 dark:border-slate-700 pt-8 transition-colors">
        <h4 className="text-lg font-semibold mb-5 dark:text-white">Password and Authentication</h4>

        <div className="mb-6">
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors">
            Change Password
          </button>
        </div>

        <div className="mb-6">
          <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Authenticator App</h5>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            Protect your account with an extra layer of security. Once configured, you'll be required to enter your password and complete one additional step in order to sign in.
          </p>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors">
            Enable Authenticator App
          </button>
        </div>

        <div>
          <h5 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">Security Keys</h5>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
            Add an additional layer of protection to your account with a Security Key.
          </p>
          <button className="bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition-colors">
            Register a Security Key
          </button>
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-8 transition-colors">
        <h4 className="text-lg font-semibold mb-2 dark:text-white">Account Removal</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Deleting your account is permanent and cannot be undone.
        </p>
        <button className="border border-rose-200 dark:border-rose-500/30 text-rose-600 dark:text-rose-400 bg-white dark:bg-transparent px-4 py-2 rounded-lg text-sm font-medium hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
          Delete Account
        </button>
      </div>
    </div>
  )
}