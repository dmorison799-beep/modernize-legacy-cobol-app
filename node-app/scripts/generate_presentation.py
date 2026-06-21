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

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = (
        "Welcome everyone. Today we will walk through the modernization of a legacy COBOL "
        "accounting system into a modern Node.js application.\n\n"
        "This project demonstrates a complete end-to-end migration pipeline, taking a "
        "traditional mainframe-style COBOL program and converting it into a cloud-native "
        "Node.js application with full test coverage, Docker containerization, and CI/CD.\n\n"
        "The original system is a simple but representative account management application "
        "that handles credits, debits, and balance inquiries. While small in scope, it "
        "exercises the key patterns you encounter in real-world COBOL migrations: modular "
        "program structure, fixed-point arithmetic, synchronous I/O, and shared state "
        "through working storage."
    )


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

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = (
        "Here is our agenda for today. We will start by reviewing the legacy COBOL system "
        "to understand what we are working with. Then we will cover the modernization "
        "strategy we chose and why.\n\n"
        "The core of the presentation covers the architecture mapping between COBOL and "
        "Node.js, followed by a concrete code conversion example so you can see the "
        "before-and-after side by side.\n\n"
        "We will then discuss our testing strategy, which was critical for validating that "
        "the Node.js version behaves identically to the COBOL original. After that, we "
        "will review the deployment pipeline and the key technical decisions we made along "
        "the way.\n\n"
        "Finally, we will wrap up with results and next steps for further modernization."
    )


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

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = (
        "Let us look at the legacy system we are modernizing. The application is written "
        "in GnuCOBOL and follows a classic 3-tier modular architecture.\n\n"
        "The three source files each have a clear responsibility: main.cob handles the "
        "terminal menu and user interaction loop, operations.cob contains all the business "
        "logic for crediting, debiting, and viewing the balance, and data.cob acts as the "
        "data access layer managing the stored balance.\n\n"
        "A key detail is the data format. COBOL uses PIC 9(6)V99, which is a fixed-point "
        "decimal format with six integer digits and two decimal places. This means all "
        "arithmetic is done in exact decimal, with no floating-point rounding issues. "
        "Preserving this precision in Node.js was one of our main technical challenges.\n\n"
        "The system starts with an initial balance of $1,000.00 and provides four "
        "operations: view balance, credit the account, debit the account with insufficient "
        "funds protection, and exit."
    )


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

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = (
        "Our modernization strategy was built around five key principles.\n\n"
        "First, file-for-file migration. Rather than rewriting the entire application from "
        "scratch, we mapped each COBOL source file to exactly one Node.js module. This "
        "preserves the original separation of concerns and makes it easy to trace how each "
        "piece of the COBOL system maps to the new codebase.\n\n"
        "Second, behavior preservation. The business logic and validation rules in Node.js "
        "are identical to the COBOL version. If the COBOL system rejects an overdraft, the "
        "Node.js version must reject it with the same message and leave the balance "
        "unchanged.\n\n"
        "Third, test-driven validation. We created a comprehensive test suite based on the "
        "existing TESTPLAN.md to verify that every scenario behaves exactly as it did in "
        "COBOL. This gives us confidence that the migration is faithful.\n\n"
        "Fourth, incremental deployment using Docker, so we can roll out gradually from "
        "development to staging to production. And fifth, documentation was created "
        "alongside the code, not as an afterthought."
    )


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

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = (
        "This table shows the detailed mapping between COBOL constructs and their Node.js "
        "equivalents.\n\n"
        "The three source files map one-to-one: main.cob becomes src/main.js, "
        "operations.cob becomes src/operations.js, and data.cob becomes src/data.js. Each "
        "module retains its original responsibility.\n\n"
        "For the data format, COBOL's PIC 9(6)V99 fixed-point type is replicated using "
        "Math.round(x * 100) / 100 in JavaScript. This ensures we get the same two-decimal "
        "precision without floating-point drift. For example, in raw JavaScript, 0.1 + 0.2 "
        "equals 0.30000000000000004, but our rounding approach correctly produces 0.30.\n\n"
        "COBOL's CALL statement, which invokes subprograms by name, maps naturally to "
        "Node.js require() for module imports. And COBOL's ACCEPT statement for terminal "
        "input is replaced by the readline-sync library, which provides the same "
        "synchronous, blocking I/O behavior."
    )


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

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = (
        "Let us look at a concrete code conversion example. Here we compare the debit "
        "operation side by side, COBOL on the left and Node.js on the right.\n\n"
        "In the COBOL version, the program accepts the debit amount from the terminal, "
        "reads the current balance from the data program, checks if there are sufficient "
        "funds, and either subtracts the amount and writes the new balance, or displays an "
        "insufficient funds message.\n\n"
        "The Node.js version follows the exact same logic flow. Notice how the function "
        "first rounds the input amount to two decimal places using Math.round, reads the "
        "balance from the data module, performs the same greater-than-or-equal check, and "
        "returns a result object.\n\n"
        "One key improvement in the Node.js version is that functions return result objects "
        "with balance and message properties instead of printing directly to the console. "
        "This makes the business logic fully testable without needing to mock console.log. "
        "The success flag in the return value makes it easy for callers to check whether "
        "the debit was approved or rejected."
    )


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

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = (
        "Testing was a critical part of this migration. We needed to prove that the Node.js "
        "application behaves identically to the COBOL original in every scenario.\n\n"
        "We built 26 tests across 3 test suites using Jest, achieving 100 percent coverage "
        "on the data and operations modules. The test cases were derived directly from the "
        "existing TESTPLAN.md document, ensuring traceability back to the original business "
        "requirements.\n\n"
        "The unit tests for the data module verify basic read, write, and reset operations. "
        "The operations module tests cover all the core scenarios: viewing the balance, "
        "crediting with valid and zero amounts, debiting with valid amounts, handling "
        "insufficient funds, and debiting with zero.\n\n"
        "The integration tests go further by simulating complete user sessions. For example, "
        "the full workflow test performs a view, then a credit, then a debit, and verifies "
        "the balance at each step. We also test edge cases like draining the account to "
        "zero and then recovering with a credit, which validates that state persists "
        "correctly across module boundaries.\n\n"
        "We also verified floating-point precision specifically. Crediting 0.1 + 0.2 must "
        "produce exactly 0.30, not 0.30000000000000004."
    )


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

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = (
        "Our deployment pipeline has seven stages, all automated through a single deploy "
        "script.\n\n"
        "First, we validate the environment: checking that Node.js 18 or higher is "
        "installed, that npm is available, and that Docker is present for staging and "
        "production deployments.\n\n"
        "Then we do a clean install of dependencies with npm ci, which ensures reproducible "
        "builds from the lockfile. Next, ESLint runs static analysis to catch code quality "
        "issues before any tests run.\n\n"
        "The test stage runs the full Jest suite with coverage reporting. If any test "
        "fails, the pipeline stops immediately so we never deploy broken code.\n\n"
        "For staging and production, we build a Docker image using a multi-stage Alpine "
        "build. The first stage installs production dependencies, and the second stage "
        "creates a minimal runtime image with a non-root user for security. The image "
        "includes health checks for container orchestration.\n\n"
        "The push stage sends the image to a container registry like GitHub Container "
        "Registry, and finally the deploy stage runs the container with appropriate "
        "resource limits and restart policies.\n\n"
        "The entire pipeline is invoked with a single command: deploy.sh followed by the "
        "environment name. In development mode, it skips Docker and runs directly."
    )


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

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = (
        "Let me walk through the key technical decisions we made and the reasoning behind "
        "each one.\n\n"
        "We chose readline-sync for terminal I/O because it provides synchronous, blocking "
        "input, which matches how COBOL's ACCEPT statement works. This keeps the migration "
        "faithful to the original. In a future phase, we could swap this for an async API "
        "layer using Express.js without changing the business logic.\n\n"
        "For data storage, we kept an in-memory variable, mirroring COBOL's working-storage "
        "section. This is intentional for the migration phase. The data module provides a "
        "clean interface with readBalance and writeBalance, so swapping in a real database "
        "later is a straightforward change.\n\n"
        "Math.round for precision was essential. JavaScript uses IEEE 754 floating-point, "
        "which can produce tiny rounding errors. Our approach of rounding to two decimal "
        "places after every calculation replicates COBOL's fixed-point behavior exactly.\n\n"
        "Jest was selected for testing because it is the industry standard for Node.js, has "
        "excellent coverage reporting, and its test case structure maps naturally to our "
        "existing TESTPLAN.md.\n\n"
        "The Docker multi-stage build produces a minimal Alpine-based image, runs as a "
        "non-root user for security, and includes health checks so container orchestrators "
        "can monitor the application. The GitHub Actions pipeline tests against both Node "
        "18 and 20 to ensure forward compatibility."
    )


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

    # Speaker notes
    notes = slide.notes_slide.notes_text_frame
    notes.text = (
        "To summarize what we achieved: we successfully converted all three COBOL source "
        "files into three Node.js modules, maintaining the original modular architecture.\n\n"
        "We have 26 passing tests covering both unit and integration scenarios, with 100 "
        "percent coverage on the business logic modules. The application is fully "
        "containerized with Docker and has a complete CI/CD pipeline using GitHub Actions.\n\n"
        "Looking ahead, there are several natural next steps. Adding a REST API layer with "
        "Express.js would make the application accessible over HTTP instead of just the "
        "terminal. Replacing the in-memory store with PostgreSQL would add persistence "
        "across restarts. Authentication and authorization would be needed for a "
        "multi-user environment.\n\n"
        "Transaction history and audit logging would provide accountability, which is "
        "especially important for financial applications. Monitoring and alerting would "
        "ensure we know about issues before users do. And finally, performance benchmarking "
        "against the original COBOL system would give us concrete data on how the "
        "modernized version compares.\n\n"
        "Thank you for your time. I am happy to answer any questions about the migration "
        "process, the technical decisions, or the next steps."
    )


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
