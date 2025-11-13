#!/usr/bin/env python3
"""
Automated fix script for beauty salon project based on Gemini chat transcript.
This script applies all the necessary changes to resolve import errors and database issues.
"""

import os
import re
import shutil
import time
from pathlib import Path

class SalonProjectFixer:
    def __init__(self, project_root=None):
        self.project_root = Path(project_root) if project_root else Path.cwd()
        self.backup_dir = self.project_root / ("backup_" + str(int(time.time())))

    def backup_file(self, file_path):
        """Create a backup of the file before modification"""
        backup_path = self.backup_dir / file_path.relative_to(self.project_root)
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file_path, backup_path)
        print(f"Backed up: {file_path} -> {backup_path}")

    def fix_landing_page_import(self):
        """Fix animejs import in LandingPage.jsx"""
        file_path = self.project_root / "src" / "pages" / "LandingPage" / "LandingPage.jsx"

        if not file_path.exists():
            print(f"Warning: {file_path} not found")
            return

        self.backup_file(file_path)

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix import statement
        content = re.sub(
            r"import anime from 'animejs';",
            "",
            content
        )

        # Remove the pricing toggle animation code
        animation_pattern = r"\s*// Pricing toggle animation.*?}, \[isAnnualBilling\]\);"
        content = re.sub(animation_pattern, "", content, flags=re.DOTALL)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Fixed LandingPage.jsx import and removed animation code")

    def fix_pricing_component(self):
        """Fix Pricing.jsx to use framer-motion instead of animejs"""
        file_path = self.project_root / "src" / "LandingPage" / "components" / "Pricing.jsx"

        if not file_path.exists():
            # Try alternative path
            file_path = self.project_root / "src" / "pages" / "LandingPage" / "components" / "Pricing.jsx"
            if not file_path.exists():
                print(f"Warning: Pricing.jsx not found in expected locations")
                return

        self.backup_file(file_path)

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Add framer-motion import
        if "import { motion } from 'framer-motion';" not in content:
            content = re.sub(
                r"import React from 'react';",
                "import React from 'react';\\nimport { motion } from 'framer-motion';",
                content
            )

        # Fix free price span
        free_price_pattern = r'<span\\s+className="font-display\\s+text-4xl\\s+font-medium"\\s+id="free-price">Gratis</span>'
        free_price_replacement = '''<motion.span
                  key={isAnnualBilling ? 'annual' : 'monthly'}
                  className="font-display text-4xl font-medium"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  Gratis
                </motion.span>'''

        content = re.sub(free_price_pattern, free_price_replacement, content)

        # Fix premium price span
        premium_price_pattern = r'<span\\s+className="font-display\\s+text-4xl\\s+font-medium"\\s+id="premium-price">\\$\\{isAnnualBilling\\s+\\?\\s+\'2980/Yr\'\\s+:\\s+\'298/Mo\'\\}</span>'
        premium_price_replacement = '''<motion.span
                  key={isAnnualBilling ? 'annual-pro' : 'monthly-pro'}
                  className="font-display text-4xl font-medium"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  ${isAnnualBilling ? '2980/Yr' : '298/Mo'}
                </motion.span>'''

        content = re.sub(premium_price_pattern, premium_price_replacement, content)

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Fixed Pricing.jsx to use framer-motion")

    def fix_server_routes(self):
        """Fix server route configuration"""
        file_path = self.project_root / "server.cjs"

        if not file_path.exists():
            print(f"Warning: server.cjs not found")
            return

        self.backup_file(file_path)

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix auth routes path
        content = re.sub(
            r"app\\.use\\('/api',\\s*authRoutes\\);",
            "app.use('/api/auth', authRoutes);",
            content
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Fixed server route configuration")

    def fix_auth_routes_db_access(self):
        """Fix database access patterns in auth.routes.cjs"""
        file_path = self.project_root / "routes" / "auth.routes.cjs"

        if not file_path.exists():
            print(f"Warning: auth.routes.cjs not found")
            return

        self.backup_file(file_path)

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Fix signup route - users access
        content = re.sub(
            r"const users = db\\.get\\('users'\\)\\.value\\(\\);",
            "const users = db.data.users;",
            content
        )

        # Fix signup route - user creation
        content = re.sub(
            r"db\\.get\\('users'\\)\\.push\\(newUser\\)\\.write\\(\\);",
            "db.data.users.push(newUser);\\n  await db.write();",
            content
        )

        # Fix signin route - user lookup
        content = re.sub(
            r"const user = db\\.get\\('users'\\)\\.find\\(\\{ email \\}\\)\\.value\\(\\);",
            "const user = db.data.users.find(u => u.email === email);",
            content
        )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Fixed database access patterns in auth.routes.cjs")

    def create_package_json_scripts(self):
        """Add dev:all script to package.json if it doesn't exist"""
        file_path = self.project_root / "package.json"

        if not file_path.exists():
            print(f"Warning: package.json not found")
            return

        self.backup_file(file_path)

        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Add dev:all script if it doesn't exist
        if '"dev:all"' not in content:
            # Find scripts section and add dev:all
            content = re.sub(
                r'("scripts":\\s*\\{[^\\}]+)',
                r'\\1"dev:all": "concurrently \\\\"npm run dev\\\\" \\\\"npm run server\\\\"",\\n    ',
                content
            )

        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"Updated package.json with dev:all script")

    def run_all_fixes(self):
        """Run all fixes in sequence"""
        print("Starting beauty salon project fixes...")
        print(f"Project root: {self.project_root}")
        print(f"Backup directory: {self.backup_dir}")

        # Create backup directory
        self.backup_dir.mkdir(exist_ok=True)

        try:
            self.fix_landing_page_import()
            self.fix_pricing_component()
            self.fix_server_routes()
            self.fix_auth_routes_db_access()
            self.create_package_json_scripts()

            print("\\n✅ All fixes applied successfully!")
            print(f"Original files backed up to: {self.backup_dir}")
            print("\\nNext steps:")
            print("1. Run 'npm install' to ensure all dependencies are installed")
            print("2. Run 'npm run dev:all' to start both frontend and backend servers")
            print("3. Check the console for any remaining errors")

        except Exception as e:
            print(f"\\n❌ Error applying fixes: {str(e)}")
            print("Check the backup directory for original files")
            raise

def main():
    """Main function to run the fixes"""
    import sys

    # Allow custom project root path
    project_root = sys.argv[1] if len(sys.argv) > 1 else None

    fixer = SalonProjectFixer(project_root)
    fixer.run_all_fixes()

if __name__ == "__main__":
    main()
