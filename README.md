# instant-form 📝

A modern, production-ready, and easily brandable form generator built with **Astro 6.3**, **Svelte 5 (Runes)**, and **TailwindCSS v4**.

## 🚀 Why instant-form?

`instant-form` is designed for developers and organizations that need high-quality, professional forms without the overhead of complex form builders. It allows you to define your entire form structure, branding, and security settings in a single **YAML** file.

**Key Benefits:**
- **Modern UX:** Built-in support for sections, progress tracking, and interactive components like drag-and-drop ranking.
- **Security First:** Client-side **Asymmetric Encryption (RSA-OAEP)** using the Web Crypto API ensures data is secured before it even leaves the user's browser.
- **Brandable:** Customize colors, logos, and even load **Google Fonts** directly from the configuration.
- **Developer Friendly:** Mobile-first, stateless by design, and strictly typed with TypeScript.
- **Ultra Fast:** Leverages Astro's Content Layer for high-performance static generation.

---

## 🛠 Supported Question Types

| Type | Description | Data Format |
| :--- | :--- | :--- |
| **`text`** | Short or Long text with Regex validation. | `string` |
| **`mask`** | Formatted inputs (e.g., phone numbers, zip codes). | `string` |
| **`dropdown`** | Space-saving single-choice selection. | `string` |
| **`star`** | Visual star ratings (configurable max stars). | `number` |
| **`ranking`** | Interactive **Drag-and-Drop** or button-based ordering. | `string[]` |
| **`matrix`** | Grid-based rating for multiple items. | `Record<string, string>` |
| **`hidden`** | Background metadata (campaign IDs, etc.). | `any` |

### Structural Features
- **Sections:** Group questions into logical blocks with titles.
- **Images:** Add up to 3 images per question from your `#assets/` folder.
- **Review Summary:** An automated final step for users to verify their answers before submission.
- **Custom Feedback Pages:** Fully customizable **Success** and **Failure** pages with support for custom messages and branding images.
- **Markdown Links:** The **About**, **Success**, and **Failure** page content supports basic markdown link syntax `[Link Text](https://example.com)`, rendered with consistent branding.

---

## ⚙️ Configuration (`src/content/form.yaml`)

The form is driven by a YAML file. Here is a breakdown of the structure:

### Branding & UI
```yaml
project:
  name: "Service Feedback"
  description: "Help us improve our workflow"

branding:
  logo_url: "/logo.svg" # Found in public/
  fonts:
    google_fonts_url: "https://fonts.googleapis.com/css2?family=Montserrat&display=swap"
    display: "Montserrat"
  colors:
    primary: "#2563eb"
    background: "#ffffff"
    surface: "#f9fafb"
    text: "#000000"
    border: "rgba(0, 0, 0, 0.1)" # Supports hex, rgb, rgba, and named colors

pages:
  success:
    title: "All Set!"
    message: "Your responses were securely processed."
  failure:
    title: "Oops!"
    message: "Something went wrong. Please try again."
```

### Form Flow & Security
```yaml
settings:
  pagination_size: 3 # Questions per page
  mockMode: false    # Set true to simulate submission. When true, the JSON payload is logged to the browser console.
  submit_url: "https://api.yoursite.com/submit"
  encryption:
    public_key: |
      -----BEGIN PUBLIC KEY-----
      ...
      -----END PUBLIC KEY-----
```

---

## 🔒 Data Submission & Security

`instant-form` sends form responses to the configured `submit_url` via a **POST** request with a JSON body.

### Submission Payload

The structure of the submission JSON is **dynamically generated** based on the `questions` defined in your `src/content/form.yaml`.

- **Key Mapping:** Every `id` defined for a question in the YAML file becomes a top-level key in the responses object.
- **Flattened Structure:** Even if questions are grouped within `sections`, they are flattened into a single JSON object upon submission. There is no nesting in the payload for sections.
- **Type-Specific Values:** The value associated with each key depends on the question type (e.g., `string` for text, `number` for star ratings, `string[]` for rankings, and `Record<string, string>` for matrices).

**Example Mapping:**

If your `form.yaml` looks like this:
```yaml
questions:
  - id: "user_info"
    type: "section"
    questions:
      - id: "full_name"
        type: "text"
  - id: "satisfaction"
    type: "star"
```

The generated JSON payload (before stringification/encryption) will be:
```json
{
  "full_name": "John Doe",
  "satisfaction": 5
}
```

#### 1. Standard Submission (No Encryption)
When `encryption` is not configured in `src/content/form.yaml`, the payload is sent as a stringified JSON object within a `data` field:

**Request:** `POST {submit_url}`
**Body:**
```json
{
  "data": "{\"user_name\":\"Jane Doe\",\"rating\":5}"
}
```

#### 2. Encrypted Submission
If a `public_key` is provided in the `settings.encryption` section, the responses object is encrypted **client-side** using **RSA-OAEP (SHA-256)**.

- **Encryption Algorithm:** RSA-OAEP
- **Hashing:** SHA-256
- **Format:** The resulting encrypted binary data is encoded in **Base64**.

**Request:** `POST {submit_url}`
**Body:**
```json
{
  "data": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA..." 
}
```
*Your backend must use the corresponding private key to decrypt the Base64 string back into the JSON responses object.*

### Mock Mode
When `mockMode: true` is set in the configuration:
- No network request is made.
- The raw responses object is logged to the browser's developer console.
- The form simulates a successful submission after a short delay.

---

## 🌍 How to Use (Hosting Agnostic)

Since `instant-form` generates a standard static website, you can host it on any provider (Netlify, Vercel, Cloudflare Pages, GitHub Pages, or a simple Nginx server).

### Local Development
1. **Install dependencies:** `pnpm install`
2. **Start dev server:** `pnpm dev`
3. **Open:** `http://localhost:4321`

### Testing
- Run **Playwright** tests: `pnpm test`
- *Note: For an OS-agnostic experience, use the provided `.devcontainer`.*

### Deployment
1. **Build the project:**
   ```bash
   pnpm build
   ```
2. **Host the output:**
   The production files will be in the `dist/` directory. Simply upload this folder to your static host of choice.

### Docker Support
A production-ready `docker-compose.yaml` and `nginx.conf` are included. To run via Docker:
```bash
docker-compose up --build
```
