from datetime import datetime, timezone
from fsrs import Scheduler, Card as FSRSCard, Rating, State


def get_scheduler():
    return Scheduler(
        desired_retention=0.9,
        enable_fuzzing=True
    )

def card_review_to_fsrs_card(card_review):
    if card_review is None or card_review.state == 0:
        return FSRSCard()

    fsrs_card = FSRSCard()
    fsrs_card.due = card_review.due if card_review.due else datetime.now(timezone.utc)
    fsrs_card.stability = card_review.stability
    fsrs_card.difficulty = card_review.difficulty

    try:
        fsrs_card.state = State(card_review.state)
    except ValueError:
        fsrs_card.state = State.Learning

    return fsrs_card

def review_card(card_review, rating_int):
    scheduler = get_scheduler()
    fsrs_card = card_review_to_fsrs_card(card_review)

    rating_map = {
        1: Rating.Again,
        2: Rating.Hard,
        3: Rating.Good,
        4: Rating.Easy
    }
    rating = rating_map.get(rating_int, Rating.Good)

    new_card, review_log = scheduler.review_card(fsrs_card, rating)

    now = datetime.now(timezone.utc)
    elapsed_days = (now - fsrs_card.last_review).days if fsrs_card.last_review else 0
    scheduled_days = max(0, (new_card.due - now).days)

    updated_fields = {
        'due': new_card.due,
        'stability': new_card.stability,
        'difficulty': new_card.difficulty,
        'state': new_card.state.value,
        'reps': (card_review.reps + 1) if card_review else 1,
        'lapses': (card_review.lapses + 1) if (rating == Rating.Again and card_review) else getattr(card_review,
                                                                                                    'lapses', 0),
        'scheduled_days': scheduled_days
    }

    log_data = {
        'rating': rating.value,
        'state': new_card.state.value,
        'elapsed_days': elapsed_days,
    }

    return updated_fields, log_data


def get_preview_intervals(card_review):

    scheduler = get_scheduler()
    fsrs_card = card_review_to_fsrs_card(card_review)
    now = datetime.now(timezone.utc)

    previews = {}
    for rating in [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy]:
        new_card, _ = scheduler.review_card(fsrs_card, rating)
        interval_days = max(0, (new_card.due - now).days)
        previews[rating.value] = interval_days

    return previews


def format_interval(days):
    if days < 1:
        return "<1d"
    elif days < 30:
        return f"{days}d"
    elif days < 365:
        months = round(days / 30.0, 1)
        return f"{months}m"
    else:
        years = round(days / 365.0, 1)
        return f"{years}y"
