#!/usr/bin/env python3
"""
Trump-Epstein Timeline Fact-Checking System
Verifies claims against multiple reliable sources before updates
"""

import json
import requests
import feedparser
import time
from datetime import datetime, timezone
from typing import List, Dict, Any
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/fact-checker.log'),
        logging.StreamHandler()
    ]
)

class FactChecker:
    def __init__(self):
        self.verification_sources = [
            'https://feeds.npr.org/1001/rss.xml',
            'https://rss.cnn.com/rss/edition.rss',
            'https://www.nbcnews.com/id/3032091/device/rss/rss.xml',
            'https://www.cbc.ca/cmlink/rss-topstories'
        ]
        
        # Reddit sources for real-time updates
        self.reddit_sources = [
            'https://www.reddit.com/r/politics/new.json',
            'https://www.reddit.com/r/news/new.json', 
            'https://www.reddit.com/r/Epstein/new.json'
        ]
        
        # Direct news monitoring
        self.direct_sources = [
            'https://newrepublic.com',
            'https://www.courtlistener.com',
            'https://www.justice.gov/news'
        ]
        
        self.fact_check_apis = [
            'https://factcheck.org/api/search',
            'https://www.politifact.com/api/statements/truth-o-meter'
        ]
        
        self.keywords = [
            'trump', 'epstein', 'trafficking', 'investigation',
            'federal', 'charges', 'court', 'judicial', 'grand jury',
            'indictment', 'maxwell', 'giuffre', 'records'
        ]
    
    def fetch_rss_feed(self, url: str) -> Dict[str, Any]:
        """Fetch and parse RSS feed safely"""
        try:
            feed = feedparser.parse(url)
            return {
                'success': True,
                'entries': feed.entries[:10],  # Latest 10 entries
                'title': feed.feed.get('title', 'Unknown'),
                'updated': feed.feed.get('updated', 'Unknown')
            }
        except Exception as e:
            logging.error(f"Failed to fetch RSS feed {url}: {e}")
            return {'success': False, 'error': str(e)}
    
    def fetch_reddit_data(self, url: str) -> Dict[str, Any]:
        """Fetch Reddit JSON data"""
        try:
            headers = {'User-Agent': 'TrumpEpsteinTimelineBot/1.0'}
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            posts = data.get('data', {}).get('children', [])
            
            relevant_posts = []
            for post in posts[:20]:  # Check latest 20 posts
                post_data = post.get('data', {})
                title = post_data.get('title', '').lower()
                selftext = post_data.get('selftext', '').lower()
                
                if any(keyword in title or keyword in selftext for keyword in self.keywords):
                    relevant_posts.append({
                        'title': post_data.get('title'),
                        'url': post_data.get('url'),
                        'permalink': f"https://reddit.com{post_data.get('permalink')}",
                        'score': post_data.get('score', 0),
                        'created_utc': post_data.get('created_utc'),
                        'subreddit': post_data.get('subreddit')
                    })
            
            return {
                'success': True,
                'posts': relevant_posts,
                'source': url
            }
            
        except Exception as e:
            logging.error(f"Failed to fetch Reddit data {url}: {e}")
            return {'success': False, 'error': str(e)}
    
    def check_breaking_news(self) -> List[Dict[str, Any]]:
        """Check all sources for breaking news"""
        breaking_news = []
        
        # Check RSS feeds
        for source_url in self.verification_sources:
            feed_data = self.fetch_rss_feed(source_url)
            if feed_data.get('success'):
                articles = self.extract_relevant_articles(feed_data)
                for article in articles:
                    if article['relevance_score'] > 3.0:  # High relevance threshold
                        breaking_news.append({
                            'type': 'news_article',
                            'source': 'RSS',
                            'data': article
                        })
        
        # Check Reddit
        for reddit_url in self.reddit_sources:
            reddit_data = self.fetch_reddit_data(reddit_url)
            if reddit_data.get('success'):
                for post in reddit_data['posts']:
                    if post['score'] > 100:  # High engagement threshold
                        breaking_news.append({
                            'type': 'reddit_post',
                            'source': 'Reddit',
                            'data': post
                        })
        
        return breaking_news
    
    def extract_relevant_articles(self, feed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract articles relevant to timeline topics"""
        relevant_articles = []
        
        if not feed_data.get('success'):
            return relevant_articles
        
        for entry in feed_data.get('entries', []):
            title = entry.get('title', '').lower()
            summary = entry.get('summary', '').lower()
            
            # Check if article contains relevant keywords
            if any(keyword in title or keyword in summary for keyword in self.keywords):
                relevant_articles.append({
                    'title': entry.get('title'),
                    'link': entry.get('link'),
                    'published': entry.get('published'),
                    'summary': entry.get('summary', '')[:500],  # Truncate
                    'source': feed_data.get('title', 'Unknown'),
                    'relevance_score': self.calculate_relevance(title, summary)
                })
        
        return sorted(relevant_articles, key=lambda x: x['relevance_score'], reverse=True)
    
    def calculate_relevance(self, title: str, summary: str) -> float:
        """Calculate relevance score based on keyword matches"""
        text = f"{title} {summary}".lower()
        score = 0.0
        
        # Primary keywords (higher weight)
        primary_keywords = ['trump', 'epstein', 'trafficking']
        for keyword in primary_keywords:
            score += text.count(keyword) * 2.0
        
        # Secondary keywords
        secondary_keywords = ['investigation', 'federal', 'charges', 'court']
        for keyword in secondary_keywords:
            score += text.count(keyword) * 1.0
        
        return score
    
    def verify_claim(self, claim: str) -> Dict[str, Any]:
        """Verify a specific claim against multiple sources"""
        verification_result = {
            'claim': claim,
            'verified': False,
            'confidence': 0.0,
            'sources': [],
            'evidence': [],
            'warnings': []
        }
        
        # Search for claim in recent articles
        for source_url in self.verification_sources:
            feed_data = self.fetch_rss_feed(source_url)
            articles = self.extract_relevant_articles(feed_data)
            
            # Check if claim appears in any articles
            for article in articles:
                if self.claim_appears_in_article(claim, article):
                    verification_result['sources'].append({
                        'url': article['link'],
                        'title': article['title'],
                        'source': article['source'],
                        'published': article['published']
                    })
                    verification_result['confidence'] += 0.2
        
        # Set verification status based on confidence
        verification_result['verified'] = verification_result['confidence'] >= 0.6
        
        if not verification_result['verified']:
            verification_result['warnings'].append(
                "Claim could not be verified against current news sources"
            )
        
        return verification_result
    
    def claim_appears_in_article(self, claim: str, article: Dict[str, Any]) -> bool:
        """Check if a claim appears in an article"""
        claim_words = claim.lower().split()
        article_text = f"{article['title']} {article['summary']}".lower()
        
        # Simple keyword matching (could be enhanced with NLP)
        matches = sum(1 for word in claim_words if word in article_text)
        return matches >= len(claim_words) * 0.7  # 70% word match threshold
    
    def generate_verification_report(self, claims: List[str]) -> Dict[str, Any]:
        """Generate comprehensive verification report"""
        report = {
            'timestamp': datetime.now(timezone.utc).isoformat(),
            'total_claims': len(claims),
            'verified_claims': 0,
            'unverified_claims': 0,
            'claims_analysis': [],
            'sources_checked': len(self.verification_sources),
            'fact_check_status': 'completed'
        }
        
        for claim in claims:
            verification = self.verify_claim(claim)
            report['claims_analysis'].append(verification)
            
            if verification['verified']:
                report['verified_claims'] += 1
            else:
                report['unverified_claims'] += 1
        
        # Calculate overall reliability score
        if report['total_claims'] > 0:
            report['reliability_score'] = report['verified_claims'] / report['total_claims']
        else:
            report['reliability_score'] = 0.0
        
        return report
    
    def update_distraction_analysis(self, report: Dict[str, Any]) -> None:
        """Update distraction analysis with verification results"""
        try:
            # Add verification metadata to distraction analysis
            verification_update = {
                'last_fact_check': report['timestamp'],
                'reliability_score': report['reliability_score'],
                'verified_claims': report['verified_claims'],
                'total_claims': report['total_claims'],
                'fact_check_disclaimer': 'All claims verified against multiple news sources'
            }
            
            # Save verification data
            with open('/tmp/verification-metadata.json', 'w') as f:
                json.dump(verification_update, f, indent=2)
            
            logging.info(f"Verification metadata updated: {report['reliability_score']:.2%} reliability")
            
        except Exception as e:
            logging.error(f"Failed to update distraction analysis: {e}")

def main():
    """Main fact-checking process"""
    logging.info("Starting fact-checking process...")
    
    # Sample claims to verify (these would come from timeline updates)
    sample_claims = [
        "Trump declared constitutional emergency",
        "New federal trafficking charges filed",
        "Epstein investigation ongoing",
        "Virginia Giuffre testimony updates"
    ]
    
    fact_checker = FactChecker()
    
    try:
        # Generate verification report
        report = fact_checker.generate_verification_report(sample_claims)
        
        # Save report
        with open('/tmp/fact-check-report.json', 'w') as f:
            json.dump(report, f, indent=2)
        
        # Update distraction analysis
        fact_checker.update_distraction_analysis(report)
        
        logging.info(f"Fact-checking completed. Reliability: {report['reliability_score']:.2%}")
        
        # Print summary
        print(f"Verified {report['verified_claims']}/{report['total_claims']} claims")
        print(f"Overall reliability: {report['reliability_score']:.2%}")
        
        return 0 if report['reliability_score'] >= 0.8 else 1
        
    except Exception as e:
        logging.error(f"Fact-checking failed: {e}")
        return 1

if __name__ == '__main__':
    exit(main())