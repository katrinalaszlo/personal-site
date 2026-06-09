---
description: "QA and send newsletter for a blog post. Previews email content, shows subscriber list, then sends after confirmation."
---

# /send-newsletter — Newsletter Send Workflow

Send a newsletter to subscribers after publishing a blog post. Previews the email,
shows who will receive it, and sends only after explicit confirmation.

Post to send: $ARGUMENTS (slug or filename -- if blank, detect from recent changes or newest post)

## Phase 1: Detect target post

1. If $ARGUMENTS is provided, use it as the slug (strip `.md`/`.html` if present).
2. Otherwise, check `git diff --name-only` and `git diff --cached --name-only` for `.md` files in `blog/`.
3. Fallback: find the most recently modified `.md` file in `public/blog/`.
4. Read the `.md` file and parse YAML frontmatter: title, date, description, author.
5. If title or description is missing, stop and ask the user.

## Phase 2: Generate email content

The email body should be a teaser, not the full post. Build it as simple HTML:

1. Opening `<p>`: the post's `description` from frontmatter.
2. Next 1-2 paragraphs from the post body (skip the H1 title, skip images).
   Convert markdown bold/italic/links to HTML inline elements.
   Keep it under ~150 words total.
3. The email subject = the post title.
4. The "Read on site" URL = `https://katrinalaszlo.com/blog/{slug}`

Do NOT include images, headers, or the full post in the email body.

## Phase 3: Fetch and display subscriber list

1. Source the BLOB_READ_WRITE_TOKEN from `.env.local` in the project root:
   ```
   BLOB_TOKEN=$(grep BLOB_READ_WRITE_TOKEN .env.local | cut -d= -f2-)
   ```

2. List blobs to find the subscribers file:
   ```
   curl -s "https://blob.vercel-storage.com?prefix=subscribers.json" \
     -H "Authorization: Bearer $BLOB_TOKEN"
   ```

3. From the response, extract the blob `url` and fetch it:
   ```
   curl -s "$BLOB_URL" -H "Authorization: Bearer $BLOB_TOKEN"
   ```

4. Parse the JSON array of email addresses.

5. Display to the user:
   - Total subscriber count
   - Full list of email addresses (these are real people, user needs to see who gets it)

6. If 0 subscribers, stop: "No subscribers yet. Nobody to send to."

## Phase 4: Email preview

1. Copy the `buildEmailHtml` template from `pages/api/send-newsletter.js` and render it with:
   - `title`: the post title
   - `url`: `https://katrinalaszlo.com/blog/{slug}`
   - `content`: the teaser HTML from Phase 2
   - `email`: use `preview@example.com` as the placeholder

2. Write the rendered HTML to `/tmp/newsletter-preview-{slug}.html`

3. Open it in the default browser:
   ```
   open /tmp/newsletter-preview-{slug}.html
   ```

4. Tell the user: "Preview opened in browser. Check the email looks right."

## Phase 5: Test send

Before sending to everyone, send a test to the user's own email.

1. Source the admin secret from `.env.local`:
   ```
   ADMIN_SECRET=$(grep NEWSLETTER_ADMIN_SECRET .env.local | cut -d= -f2-)
   ```

2. Send test via the `testOnly` parameter (sends to ONE address, skips the subscriber list):
   ```
   curl -s -X POST https://katrinalaszlo.com/api/send-newsletter \
     -H "Content-Type: application/json" \
     -H "X-Admin-Secret: $ADMIN_SECRET" \
     -d '{"title": "...", "url": "...", "content": "...", "testOnly": "katrina.j.laszlo@gmail.com"}'
   ```

3. Tell the user: "Test email sent to katrina.j.laszlo@gmail.com. Check your inbox."

4. Ask: "Does the email look good? Send to all {N} subscribers?"
   Options: "Send to all" / "Cancel"

## Phase 6: Send to all subscribers

### If confirmed:

1. Call the production API WITHOUT `testOnly` (sends to full subscriber list):
   ```
   curl -s -X POST https://katrinalaszlo.com/api/send-newsletter \
     -H "Content-Type: application/json" \
     -H "X-Admin-Secret: $ADMIN_SECRET" \
     -d '{"title": "...", "url": "...", "content": "..."}'
   ```

2. Parse the response. Report:
   - How many sent successfully
   - Any failures (email + status)
   - Overall result

### If cancelled:
Stop. "Newsletter not sent."

## Important notes

- NEVER send to all subscribers without explicit user confirmation in Phase 6.
- ALWAYS send a test email first (Phase 5) before offering to send to all.
- The `testOnly` field in the API body sends to just that one email address, bypassing the subscriber list.
  Omitting `testOnly` sends to everyone.
- The email template in `pages/api/send-newsletter.js` is the source of truth for how emails render.
  If that template changes, this preview should match.
- The content field is raw HTML embedded in the email template. Keep it simple: `<p>` tags, `<a>` links,
  `<strong>`/`<em>`. No divs, no classes, no images.
- After sending, suggest running `/publish-post` if they haven't already QA'd the post itself.
