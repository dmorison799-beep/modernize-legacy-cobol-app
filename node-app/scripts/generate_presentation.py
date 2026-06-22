#!/usr/bin/env python3
"""
Generate PowerPoint presentation documenting the COBOL-to-Node.js migration process.

Usage:
    python3 node-app/scripts/generate_presentation.py

Output:
    node-app/docs/COBOL_to_NodeJS_Migration.pptx
"""

from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os

# Color palette
DARK_BLUE = RGBColor(0x1B, 0x36, 0x5F)
LIGHT_BLUE = RGBColor(0x4A, 0x90, 0xD9)
GREEN = RGBColor(0x27, 0xAE, 0x60)
ORANGE = RGBColor(0xF3, 0x9C, 0x12)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
DARK_GRAY = RGBColor(0x2C, 0x3E, 0x50)
LIGHT_GRAY = RGBColor(0xEC, 0xF0, 0xF1)
RED = RGBColor(0xE7, 0x4C, 0x3C)


def set_slide_bg(slide, color):
    """Set solid background color for a slide."""
    bg = slide.background.fill
    bg.solid()
    bg.fore_color.rgb = color


def add_textbox(slide, left, top, width, height, text, font_size=18,
                bold=False, color=DARK_GRAY, alignment=PP_ALIGN.LEFT, word_wrap=True):
    """Helper to add a styled textbox."""
    txBox = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = txBox.text_frame
    tf.word_wrap = word_wrap
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.bold = bold
    p.font.color.rgb = color
    p.alignment = alignment
    return tf


def add_bullet_list(slide, left, top, width, height, items, font_size=18,
                    color=DARK_GRAY, spacing=10):
    """Helper to add a bulleted list."""
    txBox = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(height))
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = item
        p.font.size = Pt(font_size)
        p.font.color.rgb = color
        p.space_after = Pt(spacing)
    return tf


def add_slide_title(slide, title, subtitle=None):
    """Add a consistent title bar to a content slide."""
    # Title background bar
    from pptx.enum.shapes import MSO_SHAPE
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(10), Inches(1.2))
    shape.fill.solid()
    shape.fill.fore_color.rgb = DARK_BLUE
    shape.line.fill.background()

    add_textbox(slide, 0.5, 0.15, 9, 0.7, title,
                font_size=30, bold=True, color=WHITE)

    if subtitle:
        add_textbox(slide, 0.5, 0.7, 9, 0.4, subtitle,
                    font_size=14, color=LIGHT_BLUE)


# ─── Slide builders ──────────────────────────────────────────────────────────

def add_title_slide(prs):
    """Slide 1: Title."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank
    set_slide_bg(slide, DARK_BLUE)

    add_textbox(slide, 1, 1.8, 8, 1.5,
                'COBOL to Node.js Modernization',
                font_size=40, bold=True, color=WHITE, alignment=PP_ALIGN.CENTER)

    add_textbox(slide, 1, 3.3, 8, 1,
                'Account Management System - Legacy Modernization Journey',
                font_size=20, color=LIGHT_BLUE, alignment=PP_ALIGN.CENTER)

    add_textbox(slide, 1, 5.5, 8, 0.5,
                'Modernization Pipeline | From Mainframe to Cloud-Native',
                font_size=14, color=RGBColor(0x95, 0xA5, 0xA6), alignment=PP_ALIGN.CENTER)


def add_agenda_slide(prs):
    """Slide 2: Agenda."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_slide_title(slide, 'Agenda')

    agenda_items = [
        '1.  Legacy System Overview',
        '2.  Modernization Strategy',
        '3.  Architecture Mapping (COBOL \u2192 Node.js)',
        '4.  Code Conversion Details',
        '5.  Testing Strategy',
        '6.  Deployment Pipeline',
        '7.  Key Decisions & Trade-offs',
        '8.  Results & Next Steps',
    ]

    add_bullet_list(slide, 1, 1.5, 8, 5, agenda_items, font_size=20, spacing=12)


def add_legacy_overview_slide(prs):
    """Slide 3: Legacy System Overview."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_slide_title(slide, 'Legacy System Overview', 'COBOL Accounting Application')

    add_textbox(slide, 0.5, 1.4, 9, 0.5,
                'Three-module COBOL application with terminal-based UI:',
                font_size=16, color=DARK_GRAY)

    modules = [
        'main.cob \u2014 User interface: menu-driven loop with EVALUATE/WHEN branching',
        'operations.cob \u2014 Business logic: CREDIT, DEBIT, TOTAL operations via CALL linkage',
        'data.cob \u2014 Persistence: READ/WRITE on STORAGE-BALANCE (PIC 9(6)V99, init 1000.00)',
    ]
    add_bullet_list(slide, 0.7, 2.0, 8.5, 2.5, modules, font_size=16, spacing=14)

    add_textbox(slide, 0.5, 4.0, 9, 0.5,
                'Key COBOL Characteristics:',
                font_size=18, bold=True, color=DARK_BLUE)

    characteristics = [
        'Fixed-point arithmetic: PIC 9(6)V99 (6 integer digits, 2 decimal)',
        'Synchronous terminal I/O: DISPLAY / ACCEPT statements',
        'Inter-program communication: CALL ... USING with LINKAGE SECTION',
        'State management: WORKING-STORAGE persists across CALL invocations',
        'Flow control: CONTINUE-FLAG drives main loop; GOBACK returns from subprograms',
    ]
    add_bullet_list(slide, 0.7, 4.5, 8.5, 3, characteristics, font_size=14, spacing=8)


def add_strategy_slide(prs):
    """Slide 4: Modernization Strategy."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_slide_title(slide, 'Modernization Strategy')

    add_textbox(slide, 0.5, 1.4, 9, 0.5,
                'Approach: 1:1 Module Migration with Behavioral Parity',
                font_size=18, bold=True, color=GREEN)

    principles = [
        'Preserve modular boundaries \u2014 each .cob file becomes one .js module',
        'Maintain exact business logic \u2014 same inputs produce same outputs',
        'Match COBOL fixed-point precision \u2014 Math.round(x * 100) / 100',
        'Keep synchronous UX \u2014 readline-sync mirrors ACCEPT/DISPLAY flow',
        'Add testability \u2014 functions return result objects instead of printing directly',
        'Containerize for deployment \u2014 Docker multi-stage build with Alpine',
    ]
    add_bullet_list(slide, 0.7, 2.1, 8.5, 2.5, principles, font_size=16, spacing=10)

    add_textbox(slide, 0.5, 4.8, 9, 0.5,
                'Why Not a Full Re-architecture?',
                font_size=18, bold=True, color=ORANGE)

    reasons = [
        'Minimizes risk: behavior is provably identical to the COBOL original',
        'Enables incremental enhancement: once migrated, modules can evolve independently',
        'Validates with existing test plan: TESTPLAN.md cases map directly to Jest tests',
    ]
    add_bullet_list(slide, 0.7, 5.3, 8.5, 2, reasons, font_size=14, spacing=8)


def add_architecture_slide(prs):
    """Slide 5: Architecture Mapping."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_slide_title(slide, 'Architecture Mapping', 'COBOL \u2192 Node.js')

    # Table header
    add_textbox(slide, 0.5, 1.4, 9, 0.4,
                'Module-by-Module Conversion:',
                font_size=18, bold=True, color=DARK_BLUE)

    # Create a table
    rows, cols = 4, 4
    table_shape = slide.shapes.add_table(rows, cols, Inches(0.5), Inches(2.0), Inches(9), Inches(1.8))
    table = table_shape.table

    headers = ['COBOL File', 'Node.js Module', 'COBOL Pattern', 'Node.js Pattern']
    data_rows = [
        ['main.cob', 'src/main.js', 'EVALUATE/WHEN + CALL', 'switch/case + require()'],
        ['operations.cob', 'src/operations.js', 'LINKAGE SECTION + PIC', 'function params + Math.round'],
        ['data.cob', 'src/data.js', 'WORKING-STORAGE', 'module-scoped variable'],
    ]

    for i, header in enumerate(headers):
        cell = table.cell(0, i)
        cell.text = header
        for paragraph in cell.text_frame.paragraphs:
            paragraph.font.size = Pt(13)
            paragraph.font.bold = True
            paragraph.font.color.rgb = WHITE
        cell.fill.solid()
        cell.fill.fore_color.rgb = DARK_BLUE

    for r, row_data in enumerate(data_rows):
        for c, value in enumerate(row_data):
            cell = table.cell(r + 1, c)
            cell.text = value
            for paragraph in cell.text_frame.paragraphs:
                paragraph.font.size = Pt(12)
                paragraph.font.color.rgb = DARK_GRAY

    # Data flow
    add_textbox(slide, 0.5, 4.2, 9, 0.4,
                'Data Flow:',
                font_size=18, bold=True, color=DARK_BLUE)

    add_textbox(slide, 0.7, 4.7, 8.5, 1.5,
                'User Input \u2192 main.js \u2192 operations.js \u2192 data.js \u2192 (in-memory store)\n'
                '     \u2191                                           |\n'
                '     \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 response \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518',
                font_size=14, color=DARK_GRAY)


def add_code_conversion_slide(prs):
    """Slide 6: Code Conversion Details."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_slide_title(slide, 'Code Conversion Details', 'Side-by-Side Comparison')

    # COBOL side
    add_textbox(slide, 0.3, 1.4, 4.5, 0.4,
                'COBOL (operations.cob)', font_size=16, bold=True, color=RED)

    cobol_code = (
        'IF OPERATION-TYPE = \'DEBIT \'\n'
        '    ACCEPT AMOUNT\n'
        '    CALL \'DataProgram\' USING\n'
        '        \'READ\', FINAL-BALANCE\n'
        '    IF FINAL-BALANCE >= AMOUNT\n'
        '        SUBTRACT AMOUNT FROM\n'
        '            FINAL-BALANCE\n'
        '        CALL \'DataProgram\' USING\n'
        '            \'WRITE\', FINAL-BALANCE\n'
        '    ELSE\n'
        '        DISPLAY "Insufficient funds"'
    )
    add_textbox(slide, 0.3, 1.9, 4.5, 4,
                cobol_code, font_size=11, color=DARK_GRAY)

    # Node.js side
    add_textbox(slide, 5.2, 1.4, 4.5, 0.4,
                'Node.js (operations.js)', font_size=16, bold=True, color=GREEN)

    nodejs_code = (
        'function debitAccount(amount) {\n'
        '  const debitAmt =\n'
        '    Math.round(amount * 100) / 100;\n'
        '  let balance =\n'
        '    data.readBalance();\n'
        '\n'
        '  if (balance >= debitAmt) {\n'
        '    balance = Math.round(\n'
        '      (balance - debitAmt) * 100\n'
        '    ) / 100;\n'
        '    data.writeBalance(balance);\n'
        '    return { success: true,\n'
        '      balance, message: ... };\n'
        '  }\n'
        '  return { success: false,\n'
        '    message: "Insufficient..." };\n'
        '}'
    )
    add_textbox(slide, 5.2, 1.9, 4.5, 4,
                nodejs_code, font_size=11, color=DARK_GRAY)

    # Key conversions
    add_textbox(slide, 0.3, 5.8, 9.4, 0.4,
                'Key Conversions:  CALL \u2192 require() | PIC 9(6)V99 \u2192 Math.round() | '
                'ACCEPT \u2192 readline-sync | GOBACK \u2192 return',
                font_size=12, bold=True, color=DARK_BLUE)


def add_testing_slide(prs):
    """Slide 7: Testing Strategy."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_slide_title(slide, 'Testing Strategy', 'Jest Test Suite with Full Coverage')

    add_textbox(slide, 0.5, 1.4, 9, 0.4,
                '26 tests covering all TESTPLAN.md scenarios:',
                font_size=16, color=DARK_GRAY)

    # Test case table
    rows, cols = 8, 3
    table_shape = slide.shapes.add_table(rows, cols, Inches(0.5), Inches(2.0), Inches(9), Inches(3.2))
    table = table_shape.table

    # Set column widths
    table.columns[0].width = Inches(1.5)
    table.columns[1].width = Inches(5.0)
    table.columns[2].width = Inches(2.5)

    headers = ['Test Case', 'Description', 'Type']
    test_data = [
        ['TC-1.1', 'View current balance', 'Unit'],
        ['TC-2.1', 'Credit account with valid amount', 'Unit'],
        ['TC-2.2', 'Credit account with zero amount', 'Unit'],
        ['TC-3.1', 'Debit account with valid amount', 'Unit'],
        ['TC-3.2', 'Debit with amount > balance (insufficient funds)', 'Unit'],
        ['TC-3.3', 'Debit account with zero amount', 'Unit'],
        ['TC-4.1', 'Full workflow: view \u2192 credit \u2192 debit \u2192 view', 'Integration'],
    ]

    for i, header in enumerate(headers):
        cell = table.cell(0, i)
        cell.text = header
        for paragraph in cell.text_frame.paragraphs:
            paragraph.font.size = Pt(13)
            paragraph.font.bold = True
            paragraph.font.color.rgb = WHITE
        cell.fill.solid()
        cell.fill.fore_color.rgb = DARK_BLUE

    for r, row_data in enumerate(test_data):
        for c, value in enumerate(row_data):
            cell = table.cell(r + 1, c)
            cell.text = value
            for paragraph in cell.text_frame.paragraphs:
                paragraph.font.size = Pt(12)
                paragraph.font.color.rgb = DARK_GRAY

    extras = [
        'Additional integration tests: multi-operation sequences, drain-to-zero, '
        'credit-after-drain, data persistence, floating-point edge cases',
    ]
    add_bullet_list(slide, 0.7, 5.5, 8.5, 1.5, extras, font_size=14, spacing=8)


def add_deployment_slide(prs):
    """Slide 8: Deployment Pipeline."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_slide_title(slide, 'Deployment Pipeline', 'scripts/deploy.sh + Docker + GitHub Actions')

    add_textbox(slide, 0.5, 1.4, 9, 0.4,
                'deploy.sh Lifecycle (7 steps):',
                font_size=18, bold=True, color=DARK_BLUE)

    steps = [
        '1. Validate environment \u2014 Node 18+, npm, Docker (staging/prod)',
        '2. Install dependencies \u2014 npm ci (production-only for prod)',
        '3. Run linter \u2014 ESLint on src/ and tests/',
        '4. Run tests \u2014 Jest with coverage reporting',
        '5. Build Docker image \u2014 Multi-stage Alpine, non-root user, health check',
        '6. Push to registry \u2014 Production only (requires DOCKER_REGISTRY env var)',
        '7. Deploy \u2014 Development: local | Staging: Docker container | Production: manual approval',
    ]
    add_bullet_list(slide, 0.7, 1.9, 8.5, 3, steps, font_size=14, spacing=8)

    add_textbox(slide, 0.5, 4.5, 9, 0.4,
                'CI/CD (GitHub Actions):',
                font_size=18, bold=True, color=DARK_BLUE)

    ci_steps = [
        'Triggers: push/PR to main (node-app/ changes only)',
        'Matrix: Node.js 18 and 20 in parallel',
        'Jobs: lint \u2192 test (with coverage upload) \u2192 Docker build verification',
    ]
    add_bullet_list(slide, 0.7, 5.0, 8.5, 1.5, ci_steps, font_size=14, spacing=8)

    # Environment table
    add_textbox(slide, 0.5, 6.0, 9, 0.4,
                'Usage:', font_size=16, bold=True, color=DARK_BLUE)

    add_textbox(slide, 0.7, 6.4, 8.5, 1,
                './scripts/deploy.sh development    # Local Node.js\n'
                './scripts/deploy.sh staging         # Docker container\n'
                './scripts/deploy.sh production      # Registry push + manual deploy',
                font_size=13, color=DARK_GRAY)


def add_decisions_slide(prs):
    """Slide 9: Key Decisions & Trade-offs."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_slide_title(slide, 'Key Decisions & Trade-offs')

    decisions = [
        ('readline-sync (synchronous I/O)',
         'Matches COBOL behavior exactly. Trade-off: blocks event loop, but acceptable '
         'for a CLI tool. Future: could migrate to async readline for server use.'),

        ('Math.round() for fixed-point',
         'Replicates PIC 9(6)V99 precision. Avoids floating-point drift (e.g., 0.1+0.2). '
         'Trade-off: not true decimal; for financial-grade apps, consider decimal.js.'),

        ('In-memory storage (no database)',
         'Mirrors COBOL WORKING-STORAGE. Trade-off: no persistence across restarts. '
         'Future: plug in SQLite/PostgreSQL behind data.js interface.'),

        ('Result objects over direct I/O',
         'Functions return { balance, message } instead of calling console.log. '
         'Enables unit testing without mocking. CLI layer handles all display.'),

        ('Docker multi-stage build',
         'Separates build (npm ci) from runtime. Production image: ~50MB Alpine with '
         'non-root user and health check. No dev dependencies in final image.'),
    ]

    y = 1.4
    for title, desc in decisions:
        add_textbox(slide, 0.5, y, 9, 0.3,
                    title, font_size=16, bold=True, color=GREEN)
        add_textbox(slide, 0.7, y + 0.35, 8.5, 0.6,
                    desc, font_size=12, color=DARK_GRAY)
        y += 1.05


def add_results_slide(prs):
    """Slide 10: Results & Next Steps."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    add_slide_title(slide, 'Results & Next Steps')

    add_textbox(slide, 0.5, 1.4, 9, 0.4,
                'Migration Results:', font_size=20, bold=True, color=GREEN)

    results = [
        '3 COBOL files \u2192 3 Node.js modules (1:1 mapping)',
        '26 passing tests (unit + integration) with coverage reporting',
        'Full deployment pipeline: dev / staging / production',
        'Containerized with Docker (multi-stage Alpine, non-root)',
        'CI/CD via GitHub Actions (Node 18/20 matrix)',
        'Complete documentation: README, ARCHITECTURE.md, TESTPLAN.md',
    ]
    add_bullet_list(slide, 0.7, 1.9, 8.5, 2.5, results, font_size=16, spacing=10)

    add_textbox(slide, 0.5, 4.5, 9, 0.4,
                'Recommended Next Steps:', font_size=20, bold=True, color=ORANGE)

    next_steps = [
        'Add persistent storage (SQLite/PostgreSQL) behind data.js interface',
        'Build REST API layer for web/mobile access',
        'Add authentication and multi-account support',
        'Migrate to async I/O for server deployment',
        'Set up monitoring and alerting (health checks already in Dockerfile)',
        'Performance benchmarking: COBOL vs Node.js throughput comparison',
    ]
    add_bullet_list(slide, 0.7, 5.0, 8.5, 2.5, next_steps, font_size=16, spacing=10)


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)

    add_title_slide(prs)
    add_agenda_slide(prs)
    add_legacy_overview_slide(prs)
    add_strategy_slide(prs)
    add_architecture_slide(prs)
    add_code_conversion_slide(prs)
    add_testing_slide(prs)
    add_deployment_slide(prs)
    add_decisions_slide(prs)
    add_results_slide(prs)

    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, '..', 'docs')
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'COBOL_to_NodeJS_Migration.pptx')

    prs.save(output_path)
    print(f'Presentation saved to: {output_path}')
    print(f'Slides: {len(prs.slides)}')


if __name__ == '__main__':
    main()
