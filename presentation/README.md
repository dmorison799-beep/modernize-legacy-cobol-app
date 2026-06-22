# Migration Presentation

PowerPoint presentation documenting the COBOL to Node.js migration process.

## Generate the Presentation

```bash
cd presentation
npm install
npm run build
```

This generates `COBOL-to-NodeJS-Migration.pptx` in this directory.

## Slides

1. **Title** — Modernizing Legacy COBOL to Node.js
2. **Problem Statement** — Challenges of maintaining legacy COBOL systems
3. **Solution Overview** — Systematic migration strategy
4. **Architecture Comparison** — COBOL structure vs Node.js (side-by-side)
5. **Code Mapping** — Key COBOL → Node.js transformations with examples
6. **Testing Strategy** — Jest test coverage aligned to TESTPLAN.md
7. **Deployment Pipeline** — Docker + deploy.sh full pipeline
8. **Migration Process** — Step-by-step process table
9. **Results & Benefits** — Before/after comparison metrics
10. **Next Steps** — Immediate actions + future enhancements

## Customization

Edit `generate-presentation.js` to modify slide content, styling, or add new slides.
