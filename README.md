## Getting Started

First time:

```
brew install stripe/stripe-cli/stripe
```

Then:



```bash
npm i
# tab 1
npm run dev
# tab 2
npm run stripe:listen
# tab 3
npm run sendcloud:listen
```

## Migrations from WooCommerce to Stripe

```
npm run migrate:clone-woo
npm run migrate:clone-stripe
npm run migrate:check-data
```

## Translation Management

To remove unused translation keys from all language files:

```bash
npm run translations:cleanup
```

This script will:
1. Scan all files in `app/`, `lib/`, and `components/` directories
2. Find all `useTranslations()` calls and extract namespaces
3. Find all `t()` calls and extract keys
4. Build a list of used translation paths
5. Remove unused keys from all translation files in `messages/`

**Note:** The script preserves the JSON structure and only removes keys that are not referenced in your code.

## Prod setup

### Stripe setup

- toggle off customers email for credit notes and invoices
- enable customers to manage their tax ids and shipping info in their customer portal
- setup invoice footer
- enable emails when card debit and bank debit fails
- setup tax rounding at invoice level
- tax rate for migration needs to be EXCLUSIVE
- update branding (logo + icon + colors)
- setup terms of service + prvacy policy links
- configure Stripe tax collection
- install billit

### New instance deployment

- vercel project
- connect neondb
- domain (OVH + vercel)
- google login creds (https://console.cloud.google.com/apis/credentials?referrer=search&project=noatec-481211&supportedpurview=project)
- google recaptcha key (https://www.google.com/recaptcha/admin/create)
- sendcloud integration + webhook
- run data migration
- email creds

### Exports customer languages

```
select cl.email, meta_value 
from mod53_usermeta um
left join mod53_wc_customer_lookup cl on um.user_id = cl.user_id
where meta_key = 'locale'
and cl.customer_id is not null
and meta_value is not null
and meta_value <> '';
```