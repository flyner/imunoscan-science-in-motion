<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->
- `src/data/catalogo-produtos-imunoscan-v3.json` is the authoritative source for the current portfolio. Historic 2016 data must never override names, codes, presentations, slugs, images or products defined in the V3 catalog.
- Product photo associations come only from each product's media data; editorial catalog cover metadata lives separately in `src/data/catalog-media.ts` so it cannot be confused with an individual product image.
