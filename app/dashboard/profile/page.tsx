import Link from 'next/link';

export default function ProfilePage() {
  // TODO: Fetch current restaurant profile data
  const profileData = {
    restaurantName: "Tony's Pizza",
    slug: "tonys-pizza",
    description: "Authentic Italian pizza and pasta made with fresh ingredients",
    cuisine: "italian",
    ownerName: "Tony Rossi",
    email: "tony@tonyspizza.com",
    phone: "(555) 123-4567",
    address: "123 Main Street, Food City, FC 12345",
    website: "https://tonyspizza.com",
    hours: {
      monday: "11:00 AM - 10:00 PM",
      tuesday: "11:00 AM - 10:00 PM",
      wednesday: "11:00 AM - 10:00 PM",
      thursday: "11:00 AM - 10:00 PM",
      friday: "11:00 AM - 11:00 PM",
      saturday: "11:00 AM - 11:00 PM",
      sunday: "12:00 PM - 9:00 PM"
    }
  };

  return (
    <div>
      <header>
        <h1>Restaurant Profile</h1>
        <p>Manage your restaurant information and settings</p>
      </header>

      <nav>
        <Link href="/dashboard">← Back to Dashboard</Link>
      </nav>

      <form>
        <fieldset>
          <legend>Restaurant Information</legend>
          
          <div>
            <label htmlFor="restaurantName">Restaurant Name</label>
            <input 
              type="text" 
              id="restaurantName" 
              name="restaurantName" 
              defaultValue={profileData.restaurantName}
              required 
            />
          </div>

          <div>
            <label htmlFor="slug">URL Slug</label>
            <input 
              type="text" 
              id="slug" 
              name="slug" 
              defaultValue={profileData.slug}
              required 
            />
            <small>Your menu will be available at: yoursite.com/{profileData.slug}</small>
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              rows={3}
              defaultValue={profileData.description}
            ></textarea>
          </div>

          <div>
            <label htmlFor="cuisine">Cuisine Type</label>
            <select id="cuisine" name="cuisine" defaultValue={profileData.cuisine}>
              <option value="">Select cuisine type</option>
              <option value="italian">Italian</option>
              <option value="american">American</option>
              <option value="mexican">Mexican</option>
              <option value="asian">Asian</option>
              <option value="mediterranean">Mediterranean</option>
              <option value="other">Other</option>
            </select>
          </div>
        </fieldset>

        <fieldset>
          <legend>Contact Information</legend>
          
          <div>
            <label htmlFor="ownerName">Owner/Manager Name</label>
            <input 
              type="text" 
              id="ownerName" 
              name="ownerName" 
              defaultValue={profileData.ownerName}
              required 
            />
          </div>

          <div>
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              defaultValue={profileData.email}
              required 
            />
          </div>

          <div>
            <label htmlFor="phone">Phone Number</label>
            <input 
              type="tel" 
              id="phone" 
              name="phone" 
              defaultValue={profileData.phone}
            />
          </div>

          <div>
            <label htmlFor="address">Address</label>
            <textarea 
              id="address" 
              name="address" 
              rows={2}
              defaultValue={profileData.address}
            ></textarea>
          </div>

          <div>
            <label htmlFor="website">Website (optional)</label>
            <input 
              type="url" 
              id="website" 
              name="website" 
              defaultValue={profileData.website}
            />
          </div>
        </fieldset>

        <fieldset>
          <legend>Business Hours</legend>
          
          <div>
            <label htmlFor="monday">Monday</label>
            <input type="text" id="monday" name="monday" defaultValue={profileData.hours.monday} />
          </div>
          <div>
            <label htmlFor="tuesday">Tuesday</label>
            <input type="text" id="tuesday" name="tuesday" defaultValue={profileData.hours.tuesday} />
          </div>
          <div>
            <label htmlFor="wednesday">Wednesday</label>
            <input type="text" id="wednesday" name="wednesday" defaultValue={profileData.hours.wednesday} />
          </div>
          <div>
            <label htmlFor="thursday">Thursday</label>
            <input type="text" id="thursday" name="thursday" defaultValue={profileData.hours.thursday} />
          </div>
          <div>
            <label htmlFor="friday">Friday</label>
            <input type="text" id="friday" name="friday" defaultValue={profileData.hours.friday} />
          </div>
          <div>
            <label htmlFor="saturday">Saturday</label>
            <input type="text" id="saturday" name="saturday" defaultValue={profileData.hours.saturday} />
          </div>
          <div>
            <label htmlFor="sunday">Sunday</label>
            <input type="text" id="sunday" name="sunday" defaultValue={profileData.hours.sunday} />
          </div>
        </fieldset>

        <div>
          <button type="submit">Save Changes</button>
          <button type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
}

export const metadata = {
  title: 'Restaurant Profile - Dashboard',
  description: 'Manage your restaurant profile information and settings.',
};
