#!/usr/bin/env python3
"""
Enhanced Photo Verification Script for Trump-Epstein Investigation
Verifies downloaded photos meet requirements and generates comprehensive reports
"""

import os
import subprocess
import json
from pathlib import Path
from datetime import datetime

def verify_image_file(filepath):
    """Enhanced image verification supporting JPEG, PNG, and WebP formats"""
    try:
        result = subprocess.run(['file', str(filepath)], capture_output=True, text=True)
        file_output = result.stdout.strip()
        
        # Determine file type
        if 'JPEG' in file_output:
            file_type = 'JPEG'
        elif 'PNG' in file_output:
            file_type = 'PNG'
        elif 'Web/P' in file_output or 'WebP' in file_output:
            file_type = 'WebP'
        else:
            file_type = 'Unknown'
        
        # Extract dimensions
        dimensions = extract_dimensions(file_output)
        
        return {
            'type': file_type,
            'dimensions': dimensions,
            'valid_format': file_type in ['JPEG', 'PNG', 'WebP'],
            'file_output': file_output
        }
    except Exception as e:
        return {
            'type': 'Error',
            'dimensions': None,
            'valid_format': False,
            'error': str(e)
        }

def extract_dimensions(file_output):
    """Extract image dimensions from file command output"""
    try:
        parts = file_output.split()
        for part in parts:
            if 'x' in part and any(c.isdigit() for c in part):
                # Clean up dimension string
                dim = part.replace(',', '').replace('.', '')
                if 'x' in dim:
                    width, height = dim.split('x')
                    if width.isdigit() and height.isdigit():
                        return {'width': int(width), 'height': int(height)}
        return None
    except:
        return None

def get_file_size(filepath):
    """Get file size in bytes"""
    try:
        return os.path.getsize(filepath)
    except:
        return 0

def meets_minimum_requirements(file_info, size):
    """Check if image meets minimum requirements"""
    # Minimum file size (5KB)
    if size < 5000:
        return False, "File too small"
    
    # Must be valid image format
    if not file_info['valid_format']:
        return False, f"Invalid format: {file_info['type']}"
    
    # Check minimum dimensions (prefer 200x200 or larger)
    if file_info['dimensions']:
        width = file_info['dimensions']['width']
        height = file_info['dimensions']['height']
        if width < 100 or height < 100:
            return False, f"Dimensions too small: {width}x{height}"
    
    return True, "Valid"

def scan_all_photos():
    """Scan all photos in the images/people directory"""
    image_dir = Path('images/people')
    results = {
        'categories': {},
        'total_files': 0,
        'valid_files': 0,
        'invalid_files': 0,
        'issues': []
    }
    
    # Scan all image files
    for category_dir in image_dir.iterdir():
        if category_dir.is_dir():
            category = category_dir.name
            results['categories'][category] = {
                'files': [],
                'valid': 0,
                'invalid': 0
            }
            
            # Check all image files in category
            for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
                for img_file in category_dir.glob(ext):
                    file_info = verify_image_file(img_file)
                    size = get_file_size(img_file)
                    is_valid, reason = meets_minimum_requirements(file_info, size)
                    
                    file_data = {
                        'filename': img_file.name,
                        'size': size,
                        'type': file_info['type'],
                        'dimensions': file_info['dimensions'],
                        'valid': is_valid,
                        'reason': reason
                    }
                    
                    results['categories'][category]['files'].append(file_data)
                    results['total_files'] += 1
                    
                    if is_valid:
                        results['categories'][category]['valid'] += 1
                        results['valid_files'] += 1
                    else:
                        results['categories'][category]['invalid'] += 1
                        results['invalid_files'] += 1
                        results['issues'].append({
                            'file': f"{category}/{img_file.name}",
                            'issue': reason
                        })
    
    return results

def check_person_photos(person_name, category, expected_count=5):
    """Check all photos for a specific person"""
    base_name = person_name.lower().replace(' ', '-')
    photo_dir = Path(f'images/people/{category}')
    
    print(f"\n📸 Checking {person_name} ({category}):")
    
    found_photos = []
    missing_photos = []
    invalid_photos = []
    
    # Check both numbered photos and base photo
    files_to_check = [f"{base_name}.jpg"]
    files_to_check.extend([f"{base_name}-{i}.jpg" for i in range(1, expected_count + 1)])
    
    for filename in files_to_check:
        filepath = photo_dir / filename
        
        if filepath.exists():
            file_size = get_file_size(filepath)
            file_info = verify_image_file(filepath)
            is_valid, reason = meets_minimum_requirements(file_info, file_size)
            
            if is_valid:
                found_photos.append((filename, file_size, file_info['type']))
                print(f"  ✅ {filename} - {file_size:,} bytes - {file_info['type']}")
            else:
                invalid_photos.append((filename, file_size, reason))
                print(f"  ❌ {filename} - {reason}")
        else:
            missing_photos.append(filename)
            print(f"  ❌ {filename} - Missing")
    
    return {
        'found': found_photos,
        'missing': missing_photos, 
        'invalid': invalid_photos,
        'person': person_name,
        'category': category
    }

def generate_verification_report():
    """Generate comprehensive verification report"""
    print("🔍 Enhanced Photo Verification Report")
    print("=" * 60)
    
    # Scan all existing photos
    scan_results = scan_all_photos()
    
    print(f"📊 OVERALL STATISTICS:")
    print(f"  Total files: {scan_results['total_files']}")
    print(f"  Valid files: {scan_results['valid_files']}")
    print(f"  Invalid files: {scan_results['invalid_files']}")
    print(f"  Success rate: {(scan_results['valid_files']/scan_results['total_files']*100):.1f}%")
    print()
    
    # Category breakdown
    print("📁 CATEGORY BREAKDOWN:")
    for category, data in scan_results['categories'].items():
        print(f"  {category}: {data['valid']} valid, {data['invalid']} invalid")
        if data['files']:
            for file_data in data['files']:
                status = "✅" if file_data['valid'] else "❌"
                dims = f"{file_data['dimensions']['width']}x{file_data['dimensions']['height']}" if file_data['dimensions'] else "Unknown"
                print(f"    {status} {file_data['filename']} - {file_data['type']} - {dims} - {file_data['size']:,} bytes")
                if not file_data['valid']:
                    print(f"      Issue: {file_data['reason']}")
    print()
    
    # Issues summary
    if scan_results['issues']:
        print("⚠️  ISSUES FOUND:")
        for issue in scan_results['issues']:
            print(f"  {issue['file']}: {issue['issue']}")
        print()
    
    # Key figures check
    key_figures = [
        ('Jeffrey Epstein', 'enablers'),
        ('Ghislaine Maxwell', 'enablers'),
        ('Donald Trump', 'politicians'),
        ('Bill Clinton', 'politicians'),
        ('Prince Andrew', 'royalty'),
        ('Virginia Giuffre', 'victims'),
        ('Alan Dershowitz', 'politicians'),
        ('Bill Gates', 'business'),
        ('Stephen Hawking', 'academics'),
    ]
    
    print("👥 KEY FIGURES STATUS:")
    for person, category in key_figures:
        base_name = person.lower().replace(' ', '-')
        category_data = scan_results['categories'].get(category, {'files': []})
        
        person_files = [f for f in category_data['files'] if base_name in f['filename']]
        valid_count = sum(1 for f in person_files if f['valid'])
        total_count = len(person_files)
        
        status = "✅" if valid_count > 0 else "❌"
        print(f"  {status} {person}: {valid_count}/{total_count} valid photos")
    
    return scan_results

def update_photo_manifest(scan_results):
    """Update photo-manifest.json with current statistics"""
    manifest = {
        'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'total_photos': scan_results['valid_files'],
        'invalid_photos': scan_results['invalid_files'],
        'total_files': scan_results['total_files'],
        'success_rate': f"{(scan_results['valid_files']/scan_results['total_files']*100):.1f}%",
        'categories': list(scan_results['categories'].keys()),
        'category_stats': {
            cat: {
                'valid': data['valid'],
                'invalid': data['invalid'],
                'total': data['valid'] + data['invalid']
            } for cat, data in scan_results['categories'].items()
        },
        'issues': scan_results['issues']
    }
    
    manifest_path = Path('images/photo-manifest.json')
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)
    
    print(f"\n📄 Updated photo-manifest.json")
    return manifest

def main():
    """Main verification function"""
    # Generate comprehensive report
    scan_results = generate_verification_report()
    
    # Update manifest
    manifest = update_photo_manifest(scan_results)
    
    # Summary
    print("\n" + "=" * 60)
    if scan_results['invalid_files'] == 0:
        print("🎉 ALL PHOTOS PASS VERIFICATION!")
    else:
        print(f"⚠️  {scan_results['invalid_files']} files need attention")
        print("📝 Review issues above and re-download problematic files")
    
    return scan_results['invalid_files'] == 0

if __name__ == "__main__":
    main()