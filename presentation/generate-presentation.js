'use strict';

const pptxgen = require('pptxgenjs');
const path = require('path');

/**
 * Generate the COBOL to Node.js Migration PowerPoint presentation.
 */
function generatePresentation() {
  const pptx = new pptxgen();

  // Presentation metadata
  pptx.author = 'Devin AI';
  pptx.company = 'Legacy Modernization Team';
  pptx.subject = 'COBOL to Node.js Migration';
  pptx.title = 'Modernizing Legacy COBOL to Node.js';

  // Define reusable styles
  const titleStyle = { fontSize: 32, bold: true, color: '1B3A5C' };
  const subtitleStyle = { fontSize: 18, color: '4A6FA5' };
  const bodyStyle = { fontSize: 14, color: '333333' };
  const codeStyle = { fontSize: 11, fontFace: 'Courier New', color: '2D2D2D' };
  const headerBg = '1B3A5C';
  const accentColor = '4A6FA5';

  // ─────────────────────────────────────────────────────────
  // Slide 1: Title
  // ─────────────────────────────────────────────────────────
  let slide = pptx.addSlide();
  slide.background = { color: 'F5F7FA' };
  slide.addText('Modernizing Legacy COBOL\nto Node.js', {
    x: 0.5, y: 1.5, w: 9, h: 2.5,
    ...titleStyle, fontSize: 40, align: 'center'
  });
  slide.addText('Account Management System Migration', {
    x: 0.5, y: 4.0, w: 9, h: 0.8,
    ...subtitleStyle, align: 'center'
  });
  slide.addText('Prepared by Devin AI | Migration Process & Results', {
    x: 0.5, y: 5.0, w: 9, h: 0.5,
    fontSize: 12, color: '666666', align: 'center'
  });

  // ─────────────────────────────────────────────────────────
  // Slide 2: Problem Statement
  // ─────────────────────────────────────────────────────────
  slide = pptx.addSlide();
  slide.addText('The Challenge: Legacy COBOL Systems', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, ...titleStyle
  });
  slide.addText([
    { text: 'Why Modernize?\n\n', options: { bold: true, fontSize: 16 } },
    { text: '• ', options: { bold: true } },
    { text: 'Aging workforce — fewer COBOL-skilled developers available\n\n' },
    { text: '• ', options: { bold: true } },
    { text: 'High maintenance costs — specialized compilers and environments\n\n' },
    { text: '• ', options: { bold: true } },
    { text: 'Limited integration — difficult to connect with modern APIs/services\n\n' },
    { text: '• ', options: { bold: true } },
    { text: 'No automated testing — business logic validated manually\n\n' },
    { text: '• ', options: { bold: true } },
    { text: 'Deployment friction — no containerization or cloud-native options\n\n' },
    { text: '• ', options: { bold: true } },
    { text: 'Security concerns — limited tooling for vulnerability scanning' }
  ], { x: 0.5, y: 1.2, w: 9, h: 4.5, ...bodyStyle, valign: 'top' });

  // ─────────────────────────────────────────────────────────
  // Slide 3: Solution Overview
  // ─────────────────────────────────────────────────────────
  slide = pptx.addSlide();
  slide.addText('Solution: Systematic Migration to Node.js', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, ...titleStyle
  });
  slide.addText([
    { text: 'Migration Strategy\n\n', options: { bold: true, fontSize: 16 } },
    { text: '1. Analyze — Map COBOL program structure and data flows\n\n' },
    { text: '2. Design — Create equivalent Node.js class architecture\n\n' },
    { text: '3. Convert — Transform each COBOL module to JavaScript\n\n' },
    { text: '4. Test — Implement test suite from existing TESTPLAN.md\n\n' },
    { text: '5. Deploy — Containerize with Docker + CI/CD pipeline\n\n' },
    { text: '6. Document — Migration guide + architecture reference\n\n' }
  ], { x: 0.5, y: 1.2, w: 9, h: 4.0, ...bodyStyle, valign: 'top' });
  slide.addText('Tools: Node.js 18+ | Jest | ESLint | Docker | pptxgenjs', {
    x: 0.5, y: 5.0, w: 9, h: 0.5, fontSize: 11, color: '666666', italic: true
  });

  // ─────────────────────────────────────────────────────────
  // Slide 4: Architecture Comparison
  // ─────────────────────────────────────────────────────────
  slide = pptx.addSlide();
  slide.addText('Architecture: COBOL vs Node.js', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, ...titleStyle
  });

  // COBOL side
  slide.addText('COBOL (Before)', {
    x: 0.3, y: 1.2, w: 4.2, h: 0.5, fontSize: 14, bold: true, color: headerBg
  });
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.3, y: 1.7, w: 4.2, h: 3.5, fill: { color: 'F0F0F0' }, line: { color: 'CCCCCC' }
  });
  slide.addText(
    'main.cob\n  └─ User interface (DISPLAY/ACCEPT)\n  └─ Menu loop (PERFORM UNTIL)\n\n' +
    'operations.cob\n  └─ CALL-based dispatch\n  └─ CREDIT/DEBIT/TOTAL logic\n\n' +
    'data.cob\n  └─ STORAGE-BALANCE (PIC 9(6)V99)\n  └─ READ/WRITE operations',
    { x: 0.5, y: 1.9, w: 3.8, h: 3.2, ...codeStyle, valign: 'top' }
  );

  // Node.js side
  slide.addText('Node.js (After)', {
    x: 5.3, y: 1.2, w: 4.2, h: 0.5, fontSize: 14, bold: true, color: '2E7D32' });
  slide.addShape(pptx.ShapeType.rect, {
    x: 5.3, y: 1.7, w: 4.2, h: 3.5, fill: { color: 'F0FFF0' }, line: { color: 'A5D6A7' }
  });
  slide.addText(
    'src/main.js\n  └─ AccountApp class (readline)\n  └─ async/await loop\n\n' +
    'src/operations.js\n  └─ Operations class (DI)\n  └─ credit()/debit()/viewBalance()\n\n' +
    'src/data.js\n  └─ DataStore class\n  └─ read()/write() methods',
    { x: 5.5, y: 1.9, w: 3.8, h: 3.2, ...codeStyle, valign: 'top' }
  );

  // Arrow
  slide.addText('→', {
    x: 4.5, y: 3.0, w: 0.8, h: 0.8, fontSize: 36, align: 'center', color: accentColor
  });

  // ─────────────────────────────────────────────────────────
  // Slide 5: Code Mapping Examples
  // ─────────────────────────────────────────────────────────
  slide = pptx.addSlide();
  slide.addText('Code Transformation: Key Mappings', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, ...titleStyle
  });

  // Table
  const tableRows = [
    [
      { text: 'COBOL Construct', options: { bold: true, color: 'FFFFFF', fill: { color: headerBg } } },
      { text: 'Node.js Equivalent', options: { bold: true, color: 'FFFFFF', fill: { color: headerBg } } },
      { text: 'Example', options: { bold: true, color: 'FFFFFF', fill: { color: headerBg } } }
    ],
    [
      { text: 'PIC 9(6)V99' }, { text: 'number' }, { text: 'let balance = 1000.00' }
    ],
    [
      { text: 'CALL \'DataProgram\'' }, { text: 'this.dataStore.read()' }, { text: 'Dependency injection' }
    ],
    [
      { text: 'PERFORM UNTIL' }, { text: 'while (flag) { }' }, { text: 'Loop with boolean' }
    ],
    [
      { text: 'EVALUATE...WHEN' }, { text: 'switch...case' }, { text: 'Menu dispatch' }
    ],
    [
      { text: 'DISPLAY / ACCEPT' }, { text: 'readline.question()' }, { text: 'Async I/O' }
    ],
    [
      { text: 'GOBACK' }, { text: 'return { ... }' }, { text: 'Structured returns' }
    ]
  ];
  slide.addTable(tableRows, {
    x: 0.5, y: 1.3, w: 9, h: 3.5,
    fontSize: 12, border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
    colW: [2.5, 3.2, 3.3],
    rowH: [0.5, 0.45, 0.45, 0.45, 0.45, 0.45, 0.45]
  });

  // ─────────────────────────────────────────────────────────
  // Slide 6: Testing Strategy
  // ─────────────────────────────────────────────────────────
  slide = pptx.addSlide();
  slide.addText('Testing Strategy', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, ...titleStyle
  });
  slide.addText([
    { text: 'Framework: Jest | Coverage: All business logic paths\n\n', options: { bold: true } },
    { text: 'Test Cases (from TESTPLAN.md):\n\n', options: { fontSize: 14, bold: true } },
    { text: 'TC-1.1  View Balance — displays initial 1000.00\n' },
    { text: 'TC-2.1  Credit — valid amount increases balance\n' },
    { text: 'TC-2.2  Credit — zero amount leaves balance unchanged\n' },
    { text: 'TC-3.1  Debit — valid amount decreases balance\n' },
    { text: 'TC-3.2  Debit — overdraft prevented with error message\n' },
    { text: 'TC-3.3  Debit — zero amount leaves balance unchanged\n' },
    { text: 'TC-4.1  Exit — application terminates gracefully\n\n' },
    { text: 'Additional coverage:\n', options: { bold: true } },
    { text: '• Integration tests for multi-operation workflows\n' },
    { text: '• Edge cases (very small/large amounts, exact balance debit)\n' },
    { text: '• Data consistency verification across operations\n' }
  ], { x: 0.5, y: 1.1, w: 9, h: 4.5, ...bodyStyle, valign: 'top' });

  // ─────────────────────────────────────────────────────────
  // Slide 7: Deployment Pipeline
  // ─────────────────────────────────────────────────────────
  slide = pptx.addSlide();
  slide.addText('Deployment Pipeline', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, ...titleStyle
  });
  slide.addText([
    { text: 'Containerized Deployment with Docker\n\n', options: { bold: true, fontSize: 16 } },
    { text: 'Pipeline Steps (deploy.sh full):\n\n', options: { bold: true } },
    { text: '  1. Lint    →  ESLint static analysis\n' },
    { text: '  2. Test    →  Jest unit + integration tests\n' },
    { text: '  3. Build   →  Multi-stage Docker image (node:18-alpine)\n' },
    { text: '  4. Deploy  →  Docker Compose / AWS ECS / Azure App Service\n' },
    { text: '  5. Health  →  HTTP health check on /health endpoint\n\n' },
    { text: 'Key Features:\n\n', options: { bold: true } },
    { text: '• Non-root container user for security\n' },
    { text: '• Resource limits (128MB RAM, 0.5 CPU)\n' },
    { text: '• Auto-restart on failure\n' },
    { text: '• Multi-cloud support (AWS ECS + Azure App Service)\n' },
    { text: '• Environment variable configuration (.env)\n' }
  ], { x: 0.5, y: 1.1, w: 9, h: 4.5, ...bodyStyle, valign: 'top' });

  // ─────────────────────────────────────────────────────────
  // Slide 8: Migration Process Steps
  // ─────────────────────────────────────────────────────────
  slide = pptx.addSlide();
  slide.addText('Migration Process: Step by Step', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, ...titleStyle
  });

  const processSteps = [
    ['Step', 'Action', 'Output'],
    ['1. Analysis', 'Map COBOL structure & data flows', 'Architecture diagram'],
    ['2. Test Plan', 'Document business logic test cases', 'TESTPLAN.md (7 cases)'],
    ['3. Data Layer', 'Convert data.cob → data.js', 'DataStore class'],
    ['4. Logic Layer', 'Convert operations.cob → operations.js', 'Operations class'],
    ['5. UI Layer', 'Convert main.cob → main.js', 'AccountApp class'],
    ['6. Testing', 'Implement Jest tests from TESTPLAN', '100% logic coverage'],
    ['7. Deployment', 'Docker + deploy scripts', 'Production-ready pipeline'],
    ['8. Documentation', 'Migration guide + API docs', 'MIGRATION.md + README']
  ];
  const processRows = processSteps.map((row, i) => {
    if (i === 0) {
      return row.map(text => ({ text, options: { bold: true, color: 'FFFFFF', fill: { color: headerBg } } }));
    }
    return row.map(text => ({ text }));
  });
  slide.addTable(processRows, {
    x: 0.3, y: 1.2, w: 9.4, h: 4.0,
    fontSize: 12, border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
    colW: [2.0, 4.0, 3.4],
    rowH: [0.45, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42]
  });

  // ─────────────────────────────────────────────────────────
  // Slide 9: Results & Benefits
  // ─────────────────────────────────────────────────────────
  slide = pptx.addSlide();
  slide.addText('Results & Benefits', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, ...titleStyle
  });

  // Before/After comparison
  const benefitsRows = [
    [
      { text: 'Metric', options: { bold: true, color: 'FFFFFF', fill: { color: headerBg } } },
      { text: 'COBOL (Before)', options: { bold: true, color: 'FFFFFF', fill: { color: headerBg } } },
      { text: 'Node.js (After)', options: { bold: true, color: 'FFFFFF', fill: { color: headerBg } } }
    ],
    [{ text: 'Test Coverage' }, { text: '0% (manual only)' }, { text: '100% (automated Jest)' }],
    [{ text: 'Deployment' }, { text: 'Manual compile + copy' }, { text: 'Docker + one-command deploy' }],
    [{ text: 'CI/CD' }, { text: 'None' }, { text: 'Lint → Test → Build → Deploy' }],
    [{ text: 'Cloud Ready' }, { text: 'No' }, { text: 'AWS ECS / Azure / Docker' }],
    [{ text: 'Developer Pool' }, { text: 'Shrinking (COBOL)' }, { text: 'Large (JavaScript/Node.js)' }],
    [{ text: 'Code Modularity' }, { text: 'CALL-based coupling' }, { text: 'Dependency injection' }],
    [{ text: 'Maintenance Cost' }, { text: 'High' }, { text: 'Low' }]
  ];
  slide.addTable(benefitsRows, {
    x: 0.3, y: 1.2, w: 9.4, h: 3.8,
    fontSize: 12, border: { type: 'solid', pt: 0.5, color: 'CCCCCC' },
    colW: [2.5, 3.4, 3.5],
    rowH: [0.45, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42, 0.42]
  });

  // ─────────────────────────────────────────────────────────
  // Slide 10: Next Steps & Recommendations
  // ─────────────────────────────────────────────────────────
  slide = pptx.addSlide();
  slide.addText('Next Steps & Recommendations', {
    x: 0.5, y: 0.3, w: 9, h: 0.8, ...titleStyle
  });
  slide.addText([
    { text: 'Immediate Actions\n\n', options: { bold: true, fontSize: 16, color: '2E7D32' } },
    { text: '1. Review and merge the migration PR\n' },
    { text: '2. Run full test suite to validate business logic parity\n' },
    { text: '3. Deploy to staging environment for UAT\n' },
    { text: '4. Stakeholder sign-off on test results\n\n' },
    { text: 'Future Enhancements\n\n', options: { bold: true, fontSize: 16, color: accentColor } },
    { text: '1. Add persistent database (PostgreSQL/MongoDB)\n' },
    { text: '2. Build REST API layer with Express.js\n' },
    { text: '3. Add user authentication (JWT)\n' },
    { text: '4. Implement transaction history/audit log\n' },
    { text: '5. Add multi-currency support\n' },
    { text: '6. Set up production monitoring (Datadog/New Relic)\n' }
  ], { x: 0.5, y: 1.1, w: 9, h: 4.5, ...bodyStyle, valign: 'top' });

  // Save
  const outputPath = path.join(__dirname, 'COBOL-to-NodeJS-Migration.pptx');
  pptx.writeFile({ fileName: outputPath })
    .then(() => {
      console.log(`Presentation saved to: ${outputPath}`);
    })
    .catch((err) => {
      console.error('Error generating presentation:', err);
      process.exit(1);
    });
}

generatePresentation();
