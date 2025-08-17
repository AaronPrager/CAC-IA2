#!/usr/bin/env python3
"""
ETL Script for Building District Metrics

This script processes raw district data and generates metrics for the IA2 application.
It can be run offline to update district scores and generate new data files.
"""

import json
import csv
import os
from datetime import datetime, timedelta
from typing import Dict, List, Any
import statistics

# Configuration
INPUT_DIR = "inputs"
OUTPUT_DIR = "../public/data"
DISTRICTS_FILE = "districts.json"
ALERTS_FILE = "alerts.json"
SCORES_FILE = "scores.json"

class DistrictMetricsBuilder:
    def __init__(self):
        self.districts = {}
        self.alerts = []
        self.scores = {}
        
    def load_input_data(self):
        """Load input data from various sources"""
        print("Loading input data...")
        
        # Load districts data
        districts_path = os.path.join(INPUT_DIR, DISTRICTS_FILE)
        if os.path.exists(districts_path):
            with open(districts_path, 'r') as f:
                self.districts = json.load(f)
            print(f"Loaded {len(self.districts)} districts")
        
        # Load alerts data
        alerts_path = os.path.join(INPUT_DIR, ALERTS_FILE)
        if os.path.exists(alerts_path):
            with open(alerts_path, 'r') as f:
                self.alerts = json.load(f)
            print(f"Loaded {len(self.alerts)} alerts")
    
    def calculate_district_scores(self):
        """Calculate comprehensive scores for each district"""
        print("Calculating district scores...")
        
        for district_id, district in self.districts.items():
            scores = self._calculate_scores_for_district(district)
            self.scores[district_id] = scores
            
        print(f"Calculated scores for {len(self.scores)} districts")
    
    def _calculate_scores_for_district(self, district: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate scores for a specific district"""
        # Economic score (0-100)
        economic_score = self._calculate_economic_score(district)
        
        # Demographic score (0-100)
        demographic_score = self._calculate_demographic_score(district)
        
        # Education score (0-100)
        education_score = self._calculate_education_score(district)
        
        # Health score (0-100)
        health_score = self._calculate_health_score(district)
        
        # Infrastructure score (0-100)
        infrastructure_score = self._calculate_infrastructure_score(district)
        
        # Overall weighted score
        overall_score = self._calculate_overall_score({
            'economic': economic_score,
            'demographic': demographic_score,
            'education': education_score,
            'health': health_score,
            'infrastructure': infrastructure_score
        })
        
        return {
            'districtId': district['id'],
            'economic': economic_score,
            'demographic': demographic_score,
            'education': education_score,
            'health': health_score,
            'infrastructure': infrastructure_score,
            'overall': overall_score,
            'lastUpdated': datetime.now().isoformat() + 'Z'
        }
    
    def _calculate_economic_score(self, district: Dict[str, Any]) -> int:
        """Calculate economic score based on various indicators"""
        score = 50  # Base score
        
        # GDP growth impact
        if 'gdpGrowth' in district.get('economics', {}):
            gdp_growth = district['economics']['gdpGrowth']
            if gdp_growth > 3:
                score += 20
            elif gdp_growth > 1:
                score += 10
            elif gdp_growth < -1:
                score -= 15
        
        # Unemployment impact
        if 'unemploymentRate' in district.get('economics', {}):
            unemployment = district['economics']['unemploymentRate']
            if unemployment < 4:
                score += 15
            elif unemployment < 6:
                score += 5
            elif unemployment > 8:
                score -= 15
        
        # Income impact
        if 'medianIncome' in district.get('demographics', {}):
            income = district['demographics']['medianIncome']
            if income > 100000:
                score += 15
            elif income > 70000:
                score += 10
            elif income < 50000:
                score -= 10
        
        return max(0, min(100, score))
    
    def _calculate_demographic_score(self, district: Dict[str, Any]) -> int:
        """Calculate demographic score"""
        score = 50  # Base score
        
        demographics = district.get('demographics', {})
        
        # Population growth
        if 'populationGrowth' in demographics:
            growth = demographics['populationGrowth']
            if growth > 2:
                score += 15
            elif growth > 0:
                score += 10
            elif growth < -1:
                score -= 10
        
        # Age distribution (prefer balanced)
        if 'ageDistribution' in demographics:
            age_dist = demographics['ageDistribution']
            if '65plus' in age_dist:
                senior_ratio = age_dist['65plus']
                if senior_ratio < 0.15:
                    score += 10
                elif senior_ratio > 0.25:
                    score -= 10
        
        # Education level
        if 'education' in demographics:
            edu = demographics['education']
            if 'bachelors' in edu and 'graduate' in edu:
                college_ratio = edu['bachelors'] + edu['graduate']
                if college_ratio > 0.6:
                    score += 15
                elif college_ratio > 0.4:
                    score += 10
        
        return max(0, min(100, score))
    
    def _calculate_education_score(self, district: Dict[str, Any]) -> int:
        """Calculate education score"""
        score = 50  # Base score
        
        education = district.get('education', {})
        
        # Graduation rate
        if 'graduationRate' in education:
            grad_rate = education['graduationRate']
            if grad_rate > 90:
                score += 20
            elif grad_rate > 80:
                score += 15
            elif grad_rate < 70:
                score -= 15
        
        # Test scores
        if 'testScores' in education:
            test_scores = education['testScores']
            if test_scores > 80:
                score += 15
            elif test_scores > 70:
                score += 10
            elif test_scores < 60:
                score -= 15
        
        # Teacher ratio
        if 'teacherRatio' in education:
            ratio = education['teacherRatio']
            if ratio < 18:
                score += 10
            elif ratio > 25:
                score -= 10
        
        return max(0, min(100, score))
    
    def _calculate_health_score(self, district: Dict[str, Any]) -> int:
        """Calculate health score"""
        score = 50  # Base score
        
        health = district.get('health', {})
        
        # Life expectancy
        if 'lifeExpectancy' in health:
            life_exp = health['lifeExpectancy']
            if life_exp > 80:
                score += 20
            elif life_exp > 75:
                score += 15
            elif life_exp < 70:
                score -= 15
        
        # Access to care
        if 'accessToCare' in health:
            access = health['accessToCare']
            if access > 0.9:
                score += 15
            elif access > 0.8:
                score += 10
            elif access < 0.7:
                score -= 15
        
        # Insurance coverage
        if 'insuranceCoverage' in health:
            coverage = health['insuranceCoverage']
            if coverage > 0.95:
                score += 15
            elif coverage > 0.85:
                score += 10
            elif coverage < 0.75:
                score -= 15
        
        return max(0, min(100, score))
    
    def _calculate_infrastructure_score(self, district: Dict[str, Any]) -> int:
        """Calculate infrastructure score"""
        score = 50  # Base score
        
        infrastructure = district.get('infrastructure', {})
        
        # Road quality
        if 'roadQuality' in infrastructure:
            road_quality = infrastructure['roadQuality']
            if road_quality > 0.8:
                score += 15
            elif road_quality > 0.6:
                score += 10
            elif road_quality < 0.4:
                score -= 15
        
        # Broadband access
        if 'broadbandAccess' in infrastructure:
            broadband = infrastructure['broadbandAccess']
            if broadband > 0.9:
                score += 15
            elif broadband > 0.7:
                score += 10
            elif broadband < 0.5:
                score -= 15
        
        # Public transport
        if 'publicTransport' in infrastructure:
            transport = infrastructure['publicTransport']
            if transport > 0.8:
                score += 10
            elif transport < 0.3:
                score -= 10
        
        return max(0, min(100, score))
    
    def _calculate_overall_score(self, scores: Dict[str, int]) -> int:
        """Calculate overall weighted score"""
        weights = {
            'economic': 0.25,
            'demographic': 0.20,
            'education': 0.20,
            'health': 0.20,
            'infrastructure': 0.15
        }
        
        overall = sum(scores[category] * weight for category, weight in weights.items())
        return round(overall)
    
    def generate_alerts(self):
        """Generate alerts based on score changes and thresholds"""
        print("Generating alerts...")
        
        new_alerts = []
        
        for district_id, scores in self.scores.items():
            # Check for critical scores
            if scores['overall'] < 50:
                new_alerts.append({
                    'id': f"score_{district_id}_{datetime.now().strftime('%Y%m%d')}",
                    'title': f'Critical Score Alert - {district_id}',
                    'message': f'District {district_id} has critically low overall score: {scores["overall"]}',
                    'severity': 'critical',
                    'source': 'scoring',
                    'districtId': district_id,
                    'timestamp': datetime.now().isoformat() + 'Z',
                    'status': 'active'
                })
            
            # Check for individual category warnings
            for category, score in scores.items():
                if category != 'overall' and score < 60:
                    new_alerts.append({
                        'id': f"{category}_{district_id}_{datetime.now().strftime('%Y%m%d')}",
                        'title': f'{category.title()} Score Warning - {district_id}',
                        'message': f'District {district_id} has low {category} score: {score}',
                        'severity': 'warning',
                        'source': 'scoring',
                        'districtId': district_id,
                        'timestamp': datetime.now().isoformat() + 'Z',
                        'status': 'active'
                    })
        
        self.alerts.extend(new_alerts)
        print(f"Generated {len(new_alerts)} new alerts")
    
    def save_output_data(self):
        """Save processed data to output files"""
        print("Saving output data...")
        
        # Ensure output directory exists
        os.makedirs(OUTPUT_DIR, exist_ok=True)
        
        # Save scores
        scores_path = os.path.join(OUTPUT_DIR, SCORES_FILE)
        with open(scores_path, 'w') as f:
            json.dump({
                'scores': list(self.scores.values()),
                'metadata': {
                    'totalDistricts': len(self.scores),
                    'lastUpdated': datetime.now().isoformat() + 'Z',
                    'version': '1.0.0'
                }
            }, f, indent=2)
        
        # Save updated alerts
        alerts_path = os.path.join(OUTPUT_DIR, ALERTS_FILE)
        with open(alerts_path, 'w') as f:
            json.dump({
                'alerts': self.alerts,
                'metadata': {
                    'totalAlerts': len(self.alerts),
                    'activeAlerts': len([a for a in self.alerts if a['status'] == 'active']),
                    'resolvedAlerts': len([a for a in self.alerts if a['status'] == 'resolved']),
                    'lastUpdated': datetime.now().isoformat() + 'Z',
                    'version': '1.0.0'
                }
            }, f, indent=2)
        
        print(f"Saved data to {OUTPUT_DIR}")
    
    def run(self):
        """Run the complete ETL process"""
        print("Starting District Metrics ETL Process...")
        print("=" * 50)
        
        try:
            self.load_input_data()
            self.calculate_district_scores()
            self.generate_alerts()
            self.save_output_data()
            
            print("=" * 50)
            print("ETL Process completed successfully!")
            
        except Exception as e:
            print(f"Error during ETL process: {e}")
            raise

def main():
    """Main entry point"""
    builder = DistrictMetricsBuilder()
    builder.run()

if __name__ == "__main__":
    main()
