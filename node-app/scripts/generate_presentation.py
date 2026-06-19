#!/usr/bin/env python3
"""
Generate PowerPoint presentation documenting the COBOL-to-Node.js migration process.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
import os

# Color palette
DARK_BLUE = RGBColor(0x1B, 0x36, 0x5F)
LIGHT_BLUE = RGBColor(0x4A, 0x90, 0xD9)
GREEN = RGBColor(0x27, 0xAE, 0x60)
ORANGE = RGBColor(0xF3, 0x9C, 0x12)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
DARK_GRAY = RGBColor(0x2C, 0x3E, 0x50)
LIGHT_GRAY = RGBColor(0xEC, 0xF0, 0xF1)


def add_title_slide(prs):
    """Slide 1: Title"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank layout
    
    # Background
    bg = slide.background.fill
    bg.solid()
    bg.fore_color.rgb = DARK_BLUE
    
    # Title
    txBox = slide.shapes.add_textbox(Inches(1), Inches(2), Inches(8), Inches(1.5))
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = "COBOL to Node.js Modernization"
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER
    
    # Subtitle
    txBox2 = slide.shapes.add_textbox(Inches(1), Inches(3.5), Inches(8), Inches(1))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    p2 = tf2.paragraphs[0]
    p2.text = "Account Management System - Legacy Modernization Journey"
    p2.font.size = Pt(20)
    p2.font.color.rgb = LIGHT_BLUE
    p2.alignment = PP_ALIGN.CENTER
    
    # Footer
    txBox3 = slide.shapes.add_textbox(Inches(1), Inches(5.5), Inches(8), Inches(0.5))
    tf3 = txBox3.text_frame
    p3 = tf3.paragraphs[0]
    p3.text = "Modernization Pipeline | From Mainframe to Cloud-Native"
    p3.font.size = Pt(14)
    p3.font.color.rgb = RGBColor(0x95, 0xA5, 0xA6)
    p3.alignment = PP_ALIGN.CENTER


def add_agenda_slide(prs):
    """Slide 2: Agenda"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Title
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(1))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "Agenda"
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    
    agenda_items = [
        "1. Legacy System Overview",
        "2. Modernization Strategy",
        "3. Architecture Mapping (COBOL -> Node.js)",
        "4. Code Conversion Details",
        "5. Testing Strategy",
        "6. Deployment Pipeline",
        "7. Key Decisions & Trade-offs",
        "8. Results & Next Steps",
    ]
    
    txBox2 = slide.shapes.add_textbox(Inches(1), Inches(1.3), Inches(8), Inches(5))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    for i, item in enumerate(agenda_items):
        if i == 0:
            p = tf2.paragraphs[0]
        else:
            p = tf2.add_paragraph()
        p.text = item
        p.font.size = Pt(20)
        p.font.color.rgb = DARK_GRAY
        p.space_after = Pt(12)


def add_legacy_overview_slide(prs):
    """Slide 3: Legacy System Overview"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Title
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(1))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "Legacy COBOL System Overview"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    
    # Left column - System description
    txBox2 = slide.shapes.add_textbox(Inches(0.5), Inches(1.3), Inches(4.5), Inches(5))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    
    items = [
        ("Language:", "GnuCOBOL"),
        ("Architecture:", "3-tier modular"),
        ("Data Format:", "PIC 9(6)V99 (fixed-point)"),
        ("I/O:", "Synchronous terminal"),
        ("Initial Balance:", "$1,000.00"),
        ("Operations:", "View, Credit, Debit, Exit"),
    ]
    
    for i, (label, value) in enumerate(items):
        if i == 0:
            p = tf2.paragraphs[0]
        else:
            p = tf2.add_paragraph()
        run = p.add_run()
        run.text = label + " "
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = DARK_GRAY
        run2 = p.add_run()
        run2.text = value
        run2.font.size = Pt(16)
        run2.font.color.rgb = DARK_GRAY
        p.space_after = Pt(10)
    
    # Right column - File structure
    txBox3 = slide.shapes.add_textbox(Inches(5.2), Inches(1.3), Inches(4.3), Inches(5))
    tf3 = txBox3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "Source Files:"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    p.space_after = Pt(8)
    
    files = [
        "main.cob - UI & menu loop",
        "operations.cob - Business logic",
        "data.cob - Data persistence",
    ]
    for f in files:
        p = tf3.add_paragraph()
        p.text = f"  {f}"
        p.font.size = Pt(14)
        p.font.color.rgb = DARK_GRAY
        p.space_after = Pt(6)


def add_strategy_slide(prs):
    """Slide 4: Modernization Strategy"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(1))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "Modernization Strategy"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    
    # Strategy points
    txBox2 = slide.shapes.add_textbox(Inches(0.5), Inches(1.3), Inches(9), Inches(5.5))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    
    strategies = [
        ("File-for-File Migration", 
         "Each COBOL source maps 1:1 to a Node.js module, preserving modular boundaries."),
        ("Behavior Preservation",
         "Business logic and validation rules remain identical to the COBOL implementation."),
        ("Test-Driven Validation",
         "Comprehensive tests verify the Node.js app matches COBOL behavior exactly."),
        ("Incremental Deployment",
         "Docker containerization enables gradual rollout from dev to production."),
        ("Documentation First",
         "Architecture docs, test plans, and deployment guides created alongside code."),
    ]
    
    for i, (title, desc) in enumerate(strategies):
        if i == 0:
            p = tf2.paragraphs[0]
        else:
            p = tf2.add_paragraph()
        run = p.add_run()
        run.text = f"{title}: "
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = LIGHT_BLUE
        run2 = p.add_run()
        run2.text = desc
        run2.font.size = Pt(15)
        run2.font.color.rgb = DARK_GRAY
        p.space_after = Pt(14)


def add_architecture_mapping_slide(prs):
    """Slide 5: Architecture Mapping"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(1))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "Architecture Mapping: COBOL -> Node.js"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    
    # Table-like mapping
    headers = ["COBOL Component", "Node.js Module", "Responsibility"]
    rows = [
        ["main.cob", "src/main.js", "CLI menu & program flow"],
        ["operations.cob", "src/operations.js", "Credit/Debit/View logic"],
        ["data.cob", "src/data.js", "Balance persistence"],
        ["PIC 9(6)V99", "Math.round(x*100)/100", "Fixed-point arithmetic"],
        ["CALL 'Program'", "require('./module')", "Module invocation"],
        ["ACCEPT", "readline-sync", "User input"],
    ]
    
    # Draw header
    y_start = 1.5
    col_widths = [2.8, 3.0, 3.2]
    x_starts = [0.5, 3.3, 6.3]
    
    for j, (header, x, w) in enumerate(zip(headers, x_starts, col_widths)):
        shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 
                                       Inches(x), Inches(y_start), Inches(w), Inches(0.5))
        shape.fill.solid()
        shape.fill.fore_color.rgb = DARK_BLUE
        shape.line.fill.background()
        tf = shape.text_frame
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.text = header
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER
    
    # Draw rows
    for i, row in enumerate(rows):
        y = y_start + 0.5 + (i * 0.55)
        bg_color = LIGHT_GRAY if i % 2 == 0 else WHITE
        for j, (cell, x, w) in enumerate(zip(row, x_starts, col_widths)):
            shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                                           Inches(x), Inches(y), Inches(w), Inches(0.55))
            shape.fill.solid()
            shape.fill.fore_color.rgb = bg_color
            shape.line.fill.background()
            tf = shape.text_frame
            tf.vertical_anchor = MSO_ANCHOR.MIDDLE
            p = tf.paragraphs[0]
            p.text = cell
            p.font.size = Pt(12)
            p.font.color.rgb = DARK_GRAY
            p.alignment = PP_ALIGN.CENTER


def add_code_conversion_slide(prs):
    """Slide 6: Code Conversion Example"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(0.8))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "Code Conversion: Debit Operation"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    
    # COBOL code (left)
    txBox2 = slide.shapes.add_textbox(Inches(0.3), Inches(1.1), Inches(4.7), Inches(0.4))
    tf2 = txBox2.text_frame
    p = tf2.paragraphs[0]
    p.text = "COBOL (Before)"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = ORANGE

    cobol_code = """IF OPERATION-TYPE = 'DEBIT '
  ACCEPT AMOUNT
  CALL 'DataProgram' USING
    'READ', FINAL-BALANCE
  IF FINAL-BALANCE >= AMOUNT
    SUBTRACT AMOUNT FROM
      FINAL-BALANCE
    CALL 'DataProgram' USING
      'WRITE', FINAL-BALANCE
  ELSE
    DISPLAY "Insufficient funds"
  END-IF"""
    
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                                   Inches(0.3), Inches(1.5), Inches(4.7), Inches(4.8))
    shape.fill.solid()
    shape.fill.fore_color.rgb = RGBColor(0x2D, 0x2D, 0x2D)
    shape.line.fill.background()
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.2)
    tf.margin_top = Inches(0.2)
    p = tf.paragraphs[0]
    p.text = cobol_code
    p.font.size = Pt(11)
    p.font.color.rgb = RGBColor(0xA6, 0xE2, 0x2E)
    p.font.name = "Courier New"
    
    # Node.js code (right)
    txBox3 = slide.shapes.add_textbox(Inches(5.2), Inches(1.1), Inches(4.5), Inches(0.4))
    tf3 = txBox3.text_frame
    p = tf3.paragraphs[0]
    p.text = "Node.js (After)"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = GREEN

    nodejs_code = """function debitAccount(amount) {
  const debitAmount =
    Math.round(amount * 100) / 100;
  let balance = data.readBalance();

  if (balance >= debitAmount) {
    balance = Math.round(
      (balance - debitAmount) * 100
    ) / 100;
    data.writeBalance(balance);
    return { success: true, balance };
  }

  return { success: false, balance,
    message: 'Insufficient funds' };
}"""
    
    shape2 = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE,
                                    Inches(5.2), Inches(1.5), Inches(4.5), Inches(4.8))
    shape2.fill.solid()
    shape2.fill.fore_color.rgb = RGBColor(0x2D, 0x2D, 0x2D)
    shape2.line.fill.background()
    tf = shape2.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.2)
    tf.margin_top = Inches(0.2)
    p = tf.paragraphs[0]
    p.text = nodejs_code
    p.font.size = Pt(11)
    p.font.color.rgb = RGBColor(0x66, 0xD9, 0xEF)
    p.font.name = "Courier New"


def add_testing_slide(prs):
    """Slide 7: Testing Strategy"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(1))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "Testing Strategy"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    
    # Test results summary
    txBox2 = slide.shapes.add_textbox(Inches(0.5), Inches(1.2), Inches(9), Inches(0.5))
    tf2 = txBox2.text_frame
    p = tf2.paragraphs[0]
    p.text = "26 Tests | 3 Suites | 100% Pass Rate"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = GREEN
    
    # Test categories
    categories = [
        ("Unit Tests - Data Module", [
            "readBalance returns initial value (1000.00)",
            "writeBalance persists new values",
            "resetBalance restores initial state",
        ]),
        ("Unit Tests - Operations Module", [
            "TC-1.1: View balance displays correct amount",
            "TC-2.1: Credit adds funds correctly",
            "TC-2.2: Zero credit leaves balance unchanged",
            "TC-3.1: Debit subtracts funds correctly",
            "TC-3.2: Insufficient funds rejected",
            "TC-3.3: Zero debit leaves balance unchanged",
        ]),
        ("Integration Tests", [
            "Full workflow: view -> credit -> debit -> view",
            "Multiple operations maintain correct state",
            "Drain-then-credit recovery scenario",
        ]),
    ]
    
    y = 1.8
    for cat_title, tests in categories:
        txBox3 = slide.shapes.add_textbox(Inches(0.5), Inches(y), Inches(9), Inches(0.4))
        tf3 = txBox3.text_frame
        p = tf3.paragraphs[0]
        p.text = cat_title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = LIGHT_BLUE
        y += 0.35
        
        for test in tests:
            txBox4 = slide.shapes.add_textbox(Inches(0.8), Inches(y), Inches(8.5), Inches(0.35))
            tf4 = txBox4.text_frame
            p = tf4.paragraphs[0]
            p.text = f"  {test}"
            p.font.size = Pt(12)
            p.font.color.rgb = DARK_GRAY
            y += 0.3


def add_deployment_slide(prs):
    """Slide 8: Deployment Pipeline"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(1))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "Deployment Pipeline"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    
    # Pipeline stages
    stages = [
        ("1. Validate", "Check Node.js 18+, npm, Docker"),
        ("2. Install", "npm ci (clean install)"),
        ("3. Lint", "ESLint static analysis"),
        ("4. Test", "Jest with coverage report"),
        ("5. Build", "Multi-stage Docker image (Alpine)"),
        ("6. Push", "Container registry (GHCR)"),
        ("7. Deploy", "docker run with health checks"),
    ]
    
    y = 1.3
    for stage, desc in stages:
        # Stage box
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE,
                                       Inches(0.5), Inches(y), Inches(2.2), Inches(0.55))
        shape.fill.solid()
        shape.fill.fore_color.rgb = LIGHT_BLUE
        shape.line.fill.background()
        tf = shape.text_frame
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf.paragraphs[0]
        p.text = stage
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER
        
        # Description
        txBox2 = slide.shapes.add_textbox(Inches(3.0), Inches(y), Inches(6.5), Inches(0.55))
        tf2 = txBox2.text_frame
        tf2.vertical_anchor = MSO_ANCHOR.MIDDLE
        p = tf2.paragraphs[0]
        p.text = desc
        p.font.size = Pt(14)
        p.font.color.rgb = DARK_GRAY
        
        y += 0.7
    
    # Deploy script note
    txBox3 = slide.shapes.add_textbox(Inches(0.5), Inches(y + 0.3), Inches(9), Inches(0.8))
    tf3 = txBox3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "Deploy command: ./scripts/deploy.sh [development|staging|production]"
    p.font.size = Pt(14)
    p.font.name = "Courier New"
    p.font.color.rgb = DARK_GRAY


def add_decisions_slide(prs):
    """Slide 9: Key Decisions"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(1))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "Key Decisions & Trade-offs"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = DARK_BLUE
    
    decisions = [
        ("readline-sync for I/O",
         "Matches COBOL's synchronous behavior. Could migrate to async later for web API."),
        ("In-memory data storage",
         "Mirrors COBOL's working-storage. Production would use a database."),
        ("Math.round for precision",
         "Replicates PIC 9(6)V99 fixed-point. Avoids floating-point drift."),
        ("Jest for testing",
         "Industry standard, good coverage reporting, maps to TESTPLAN.md."),
        ("Docker multi-stage build",
         "Minimal image (Alpine), non-root user, health checks for orchestration."),
        ("GitHub Actions CI/CD",
         "Matrix testing (Node 18/20), auto coverage upload, Docker validation."),
    ]
    
    txBox2 = slide.shapes.add_textbox(Inches(0.5), Inches(1.2), Inches(9), Inches(5.5))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    
    for i, (decision, rationale) in enumerate(decisions):
        if i == 0:
            p = tf2.paragraphs[0]
        else:
            p = tf2.add_paragraph()
        run = p.add_run()
        run.text = f"{decision}: "
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = DARK_BLUE
        run2 = p.add_run()
        run2.text = rationale
        run2.font.size = Pt(13)
        run2.font.color.rgb = DARK_GRAY
        p.space_after = Pt(12)


def add_results_slide(prs):
    """Slide 10: Results & Next Steps"""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Background
    bg = slide.background.fill
    bg.solid()
    bg.fore_color.rgb = DARK_BLUE
    
    txBox = slide.shapes.add_textbox(Inches(0.5), Inches(0.3), Inches(9), Inches(1))
    tf = txBox.text_frame
    p = tf.paragraphs[0]
    p.text = "Results & Next Steps"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = WHITE
    
    # Results
    txBox2 = slide.shapes.add_textbox(Inches(0.5), Inches(1.3), Inches(4.5), Inches(4))
    tf2 = txBox2.text_frame
    tf2.word_wrap = True
    p = tf2.paragraphs[0]
    p.text = "Achieved:"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = GREEN
    p.space_after = Pt(8)
    
    results = [
        "3 COBOL files -> 3 Node.js modules",
        "26 passing tests (unit + integration)",
        "100% coverage on business logic",
        "Docker containerized deployment",
        "CI/CD pipeline with GitHub Actions",
        "Full documentation suite",
    ]
    for r in results:
        p = tf2.add_paragraph()
        p.text = f"  {r}"
        p.font.size = Pt(14)
        p.font.color.rgb = WHITE
        p.space_after = Pt(6)
    
    # Next Steps
    txBox3 = slide.shapes.add_textbox(Inches(5.2), Inches(1.3), Inches(4.5), Inches(4))
    tf3 = txBox3.text_frame
    tf3.word_wrap = True
    p = tf3.paragraphs[0]
    p.text = "Next Steps:"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = ORANGE
    p.space_after = Pt(8)
    
    next_steps = [
        "Add REST API layer (Express.js)",
        "Replace in-memory with PostgreSQL",
        "Add authentication & authorization",
        "Implement transaction history/audit",
        "Add monitoring & alerting",
        "Performance benchmarking vs COBOL",
    ]
    for ns in next_steps:
        p = tf3.add_paragraph()
        p.text = f"  {ns}"
        p.font.size = Pt(14)
        p.font.color.rgb = WHITE
        p.space_after = Pt(6)


def main():
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)
    
    add_title_slide(prs)
    add_agenda_slide(prs)
    add_legacy_overview_slide(prs)
    add_strategy_slide(prs)
    add_architecture_mapping_slide(prs)
    add_code_conversion_slide(prs)
    add_testing_slide(prs)
    add_deployment_slide(prs)
    add_decisions_slide(prs)
    add_results_slide(prs)
    
    output_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(output_dir, '..', 'docs', 'COBOL_to_NodeJS_Migration.pptx')
    output_path = os.path.abspath(output_path)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    prs.save(output_path)
    print(f"Presentation saved to: {output_path}")


if __name__ == '__main__':
    main()
