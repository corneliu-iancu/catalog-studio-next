import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div>
      <header>
        <h1>Account Settings</h1>
        <p>Manage your account preferences and security settings</p>
      </header>

      <nav>
        <Link href="/dashboard">← Back to Dashboard</Link>
      </nav>

      <section>
        <h2>Account Security</h2>
        <form>
          <div>
            <label htmlFor="currentPassword">Current Password</label>
            <input type="password" id="currentPassword" name="currentPassword" required />
          </div>

          <div>
            <label htmlFor="newPassword">New Password</label>
            <input type="password" id="newPassword" name="newPassword" minLength={8} required />
          </div>

          <div>
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" minLength={8} required />
          </div>

          <button type="submit">Update Password</button>
        </form>
      </section>

      <section>
        <h2>Email Preferences</h2>
        <form>
          <div>
            <label>
              <input type="checkbox" name="emailNotifications" defaultChecked />
              Email notifications for menu updates
            </label>
          </div>

          <div>
            <label>
              <input type="checkbox" name="marketingEmails" />
              Marketing emails and product updates
            </label>
          </div>

          <div>
            <label>
              <input type="checkbox" name="weeklyReports" defaultChecked />
              Weekly performance reports
            </label>
          </div>

          <button type="submit">Save Email Preferences</button>
        </form>
      </section>

      <section>
        <h2>Menu Display Settings</h2>
        <form>
          <div>
            <label htmlFor="currency">Currency</label>
            <select id="currency" name="currency" defaultValue="USD">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD (C$)</option>
            </select>
          </div>

          <div>
            <label>
              <input type="checkbox" name="showNutrition" defaultChecked />
              Display nutritional information
            </label>
          </div>

          <div>
            <label>
              <input type="checkbox" name="showAllergens" defaultChecked />
              Display allergen information
            </label>
          </div>

          <div>
            <label>
              <input type="checkbox" name="showIngredients" defaultChecked />
              Display ingredients list
            </label>
          </div>

          <button type="submit">Save Display Settings</button>
        </form>
      </section>

      <section>
        <h2>Data Management</h2>
        <div>
          <h3>Export Data</h3>
          <p>Download a copy of your menu data</p>
          <button type="button">Export Menu Data (JSON)</button>
          <button type="button">Export Menu Data (CSV)</button>
        </div>

        <div>
          <h3>Import Data</h3>
          <p>Upload menu data from a file</p>
          <input type="file" accept=".json,.csv" />
          <button type="button">Import Data</button>
        </div>
      </section>

      <section>
        <h2>Danger Zone</h2>
        <div>
          <h3>Delete Account</h3>
          <p>Permanently delete your restaurant account and all associated data. This action cannot be undone.</p>
          <button type="button">Delete Account</button>
        </div>
      </section>
    </div>
  );
}

export const metadata = {
  title: 'Account Settings - Dashboard',
  description: 'Manage your account security, preferences, and data settings.',
};
