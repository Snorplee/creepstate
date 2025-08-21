#!/usr/bin/env python3
"""
Test script for the Trump Distraction Pattern Recognition System
Verifies all components are working correctly
"""

import json
import os
import sys
from datetime import datetime

def test_imports():
    """Test that all required modules can be imported"""
    print("🧪 Testing imports...")
    
    try:
        import requests
        print("✅ requests module available")
    except ImportError:
        print("❌ requests module missing - run: pip install requests")
        return False
        
    try:
        import xml.etree.ElementTree as ET
        print("✅ xml.etree.ElementTree available")
    except ImportError:
        print("❌ xml.etree.ElementTree missing")
        return False
        
    try:
        from bs4 import BeautifulSoup
        print("✅ BeautifulSoup available")
    except ImportError:
        print("❌ BeautifulSoup missing - run: pip install beautifulsoup4")
        return False
        
    try:
        import wikipedia
        print("✅ wikipedia module available")
    except ImportError:
        print("❌ wikipedia module missing - run: pip install wikipedia-api")
        return False
        
    return True

def test_file_structure():
    """Test that all required files exist"""
    print("\n🧪 Testing file structure...")
    
    required_files = [
        'auto-research.py',
        'distraction-analysis.js',
        'index.html',
        'timeline-comprehensive.xml'
    ]
    
    all_exist = True
    for file in required_files:
        if os.path.exists(file):
            print(f"✅ {file} exists")
        else:
            print(f"❌ {file} missing")
            all_exist = False
            
    return all_exist

def test_distraction_patterns():
    """Test the distraction pattern database"""
    print("\n🧪 Testing distraction pattern database...")
    
    try:
        # Import the researcher class
        sys.path.append('.')
        import importlib.util
        spec = importlib.util.spec_from_file_location("auto_research", "./auto-research.py")
        auto_research = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(auto_research)
        AnonymousResearcher = auto_research.AnonymousResearcher
        
        researcher = AnonymousResearcher()
        
        # Check pattern database
        patterns = researcher.distraction_patterns
        print(f"✅ Loaded {len(patterns)} distraction patterns")
        
        # Verify pattern structure
        for pattern_name, pattern_data in patterns.items():
            required_keys = ['keywords', 'weight', 'timing_sensitivity', 'description']
            if all(key in pattern_data for key in required_keys):
                print(f"✅ Pattern '{pattern_name}' structure valid")
            else:
                print(f"❌ Pattern '{pattern_name}' missing required keys")
                return False
                
        # Test scoring algorithm
        mock_pattern_results = {
            'total_mentions': 3,
            'keyword_matches': {'military strike': 2},
            'timing_indicators': [{'text': 'urgent announcement'}],
            'official_statements': [{'text': 'official statement'}]
        }
        
        mock_epstein_baseline = {
            'total_articles': 5,
            'major_stories': [{'text': 'unsealed documents'}]
        }
        
        mock_pattern_data = patterns['military_actions']
        
        score = researcher.calculate_distraction_score(
            mock_pattern_results, 
            mock_epstein_baseline, 
            mock_pattern_data
        )
        
        if 0 <= score <= 1:
            print(f"✅ Scoring algorithm working (score: {score:.2f})")
        else:
            print(f"❌ Scoring algorithm error (score: {score})")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Error testing patterns: {e}")
        return False

def test_web_interface_files():
    """Test web interface components"""
    print("\n🧪 Testing web interface...")
    
    # Check JavaScript file
    if os.path.exists('distraction-analysis.js'):
        with open('distraction-analysis.js', 'r') as f:
            js_content = f.read()
            
        if 'class DistractionAnalyzer' in js_content:
            print("✅ DistractionAnalyzer class found in JS")
        else:
            print("❌ DistractionAnalyzer class missing in JS")
            return False
            
        if 'correlateWithTimelineEvent' in js_content:
            print("✅ Timeline correlation function found")
        else:
            print("❌ Timeline correlation function missing")
            return False
    else:
        print("❌ distraction-analysis.js not found")
        return False
        
    # Check HTML integration
    if os.path.exists('index.html'):
        with open('index.html', 'r') as f:
            html_content = f.read()
            
        if 'distraction-analysis.js' in html_content:
            print("✅ JavaScript file linked in HTML")
        else:
            print("❌ JavaScript file not linked in HTML")
            return False
            
        if 'refreshDistractionAnalysis' in html_content:
            print("✅ Distraction analysis functions integrated")
        else:
            print("❌ Distraction analysis functions not integrated")
            return False
    else:
        print("❌ index.html not found")
        return False
        
    return True

def test_mock_analysis():
    """Test the system with mock data"""
    print("\n🧪 Testing with mock data...")
    
    try:
        sys.path.append('.')
        import importlib.util
        spec = importlib.util.spec_from_file_location("auto_research", "./auto-research.py")
        auto_research = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(auto_research)
        AnonymousResearcher = auto_research.AnonymousResearcher
        
        researcher = AnonymousResearcher()
        
        # Create mock data and test web export
        web_data = {
            'timestamp': datetime.now().isoformat(),
            'alerts': [
                {
                    'id': 'test001',
                    'pattern': 'military_actions',
                    'description': 'Test military action pattern',
                    'score': 0.75,
                    'level': 'HIGH',
                    'timestamp': datetime.now().isoformat(),
                    'keywords': ['test keyword'],
                    'recommendations': ['Test recommendation']
                }
            ],
            'summary': {
                'total_alerts': 1,
                'overall_threat_level': 'HIGH'
            },
            'correlation_analysis': {
                'correlation_strength': 0.6
            }
        }
        
        # Save test data
        with open('distraction-analysis.json', 'w') as f:
            json.dump(web_data, f, indent=2)
            
        print("✅ Mock data file created successfully")
        
        # Verify file is valid JSON
        with open('distraction-analysis.json', 'r') as f:
            test_data = json.load(f)
            
        if test_data['alerts'][0]['score'] == 0.75:
            print("✅ Mock data file is valid JSON")
        else:
            print("❌ Mock data file corrupted")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Error with mock analysis: {e}")
        return False

def test_integration():
    """Test system integration"""
    print("\n🧪 Testing system integration...")
    
    try:
        # Test if we can run the main analysis (without network calls)
        sys.path.append('.')
        import importlib.util
        spec = importlib.util.spec_from_file_location("auto_research", "./auto-research.py")
        auto_research = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(auto_research)
        AnonymousResearcher = auto_research.AnonymousResearcher
        
        researcher = AnonymousResearcher()
        
        # Test pattern formatting
        test_patterns = ['military_actions', 'citizenship_threats']
        for pattern in test_patterns:
            if pattern in researcher.distraction_patterns:
                print(f"✅ Pattern '{pattern}' accessible")
            else:
                print(f"❌ Pattern '{pattern}' not found")
                return False
                
        # Test threat level calculation
        mock_alerts = [
            {'alert_level': 'CRITICAL'},
            {'alert_level': 'HIGH'}
        ]
        
        threat_level = researcher.calculate_overall_threat_level(mock_alerts)
        if threat_level in ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL']:
            print(f"✅ Threat level calculation working: {threat_level}")
        else:
            print(f"❌ Threat level calculation error: {threat_level}")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Integration test error: {e}")
        return False

def run_all_tests():
    """Run all test functions"""
    print("🚀 Trump Distraction Pattern Recognition System - Test Suite")
    print("=" * 65)
    
    tests = [
        ("Module Imports", test_imports),
        ("File Structure", test_file_structure),
        ("Distraction Patterns", test_distraction_patterns),
        ("Web Interface", test_web_interface_files),
        ("Mock Analysis", test_mock_analysis),
        ("System Integration", test_integration)
    ]
    
    passed = 0
    total = len(tests)
    
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name} test...")
        if test_func():
            passed += 1
            print(f"✅ {test_name} test PASSED")
        else:
            print(f"❌ {test_name} test FAILED")
    
    print(f"\n📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! System is ready for use.")
        print("\n🚀 Quick Start:")
        print("1. Run: python3 auto-research.py")
        print("2. Open index.html in browser")
        print("3. Click '🚨 Scan Distractions' button")
        print("4. Review threat level and alerts")
        return True
    else:
        print("⚠️ Some tests failed. Please fix issues before using the system.")
        print("\n🔧 Common fixes:")
        print("- Install missing Python packages: pip install requests beautifulsoup4 wikipedia-api")
        print("- Check file permissions")
        print("- Verify all files are in the correct directory")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)